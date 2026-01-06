import { Request, Response } from "express";
import Thumbnail from "../models/ThumbnailModel.js";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
import ai from "../config/ai.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary"


const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
}

const colorSchemeDescription = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
}

export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;
        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        })

        const model = 'gemini-3-pro-image-preview';
        const generateConfig: GenerateContentConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ["IMAGE"],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1K'
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.OFF
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.OFF
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.OFF
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.OFF
                },
            ]
        }

        // ! prompt generation
        let prompt = `create a ${stylePrompts[style as keyof typeof stylePrompts]} for: "${title}"`;
        if (color_scheme) {
            prompt += `Use a ${colorSchemeDescription[color_scheme as keyof typeof colorSchemeDescription]} color scheme.`
        }
        if (user_prompt) {
            prompt += `Additional details: ${user_prompt}. `;
        }

        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold professional, and impossible to ignore.`

        // ! Gen image
        const res: any = await ai.models.generateContent({
            model,
            contents: [prompt],
            config: generateConfig
        })

        if (!res?.candidates?.[0]?.content?.parts) {
            throw new Error("Invalid Response!");
        }
        const parts = res?.candidates[0]?.content?.parts;
        let finalBuffer: Buffer | null = null;
        for (const part of parts) {
            if (part.inlineData) {
                finalBuffer = Buffer.from(part.inlineData.data, "base64");
            }
        }
        const filename = `final-output-${Date.now()}.png`;
        const filepath = path.join("images", filename);
        //! create images directory
        fs.mkdirSync("images", { recursive: true })
        fs.writeFileSync(filepath, finalBuffer!)

        // ! upload image in coudinary 
        const uploadRes = await cloudinary.uploader.upload(filepath, { resource_type: "image" });
        thumbnail.image_url = uploadRes.url;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({ message: "thumbnail Generated.", thumbnail });

        //! File removal from disk.

        fs.unlinkSync(filepath);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


//! delete thumbnail controller
export const delThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        await Thumbnail.findByIdAndDelete({ _id: id, userId });
        res.json({ message: "Thumbnail Deleted successfully!" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}