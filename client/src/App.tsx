import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGenerations from "./pages/MyGenerations";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";

export default function App() {
  const {pathname} = useLocation();
  useEffect(()=>{
    console.log(pathname);
    window.scrollTo(0,0);
  },[pathname])
  return (
    <>
      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate/:id" element={<Generate />} />
        <Route path="/my-generations" element={<MyGenerations />} />
        <Route path="/preview" element={<YtPreview />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}
