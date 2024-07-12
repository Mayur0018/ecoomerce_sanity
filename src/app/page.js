'use client'
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import Deals from "./components/Deals";
import ProductFeed from "./components/ProductFeed";
import { useSelector } from "react-redux";
export default function Home() {
  const cart  = useSelector((state)=> state.cart.cart);
  console.log(cart);
  return (
    <>
  <Header/>
  <HeroBanner/>
  <Deals/>
  <ProductFeed/>
  </>
  );
}
