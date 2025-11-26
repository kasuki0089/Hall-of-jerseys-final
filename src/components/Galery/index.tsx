import Image from "next/image"
import Link from "next/link"
import img from "@/public/images/banner-brand/NBA.png"
import img2 from "@/public/images/banner-brand/MLS.png"
import img3 from "@/public/images/banner-brand/NHL.png"
import img4 from "@/public/images/banner-brand/NFL.png"

export default function Galery(){
    return (
        <>
            <h1 className="text-3xl text-center font-bold mt-[10vh]">Ligas</h1>
            <div className="flex items-center justify-center w-[100%] h-[auto] mt-[2vh] flex-wrap">
                <Link href="/liga/nba" className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mr-8 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Image src={img} alt={"NBA"} className="w-[100%] h-[100%]"/>
                </Link>
                <Link href="/liga/mls" className="flex items-center justify-center w-[42.5vw] h-[52.5vh] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Image src={img2} alt={"MLS"} className="w-[100%] h-[100%]"/>
                </Link>
                <Link href="/liga/nhl" className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mr-8 mt-8 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Image src={img3} alt={"NHL"} className="w-[100%] h-[100%]"/>
                </Link>
                <Link href="/liga/nfl" className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mt-8 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Image src={img4} alt={"NFL"} className="w-[100%] h-[100%]"/>
                </Link>
            </div>
        </>
    )
}