import Image from "next/image"
import img from "@/public/images/banner-brand/NBA.png"
import img2 from "@/public/images/banner-brand/MLS.png"
import img3 from "@/public/images/banner-brand/NHL.png"
import img4 from "@/public/images/banner-brand/NFL.png"

export default function Galery(){
    return (
        <>
            <h1 className="text-3xl text-center font-bold mt-[10vh]">Ligas</h1>
            <div className="flex items-center justify-center w-[100%] h-[auto] mt-[2vh] flex-wrap">
                <div className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mr-8 overflow-hidden">
                    <Image src={img} alt={"Imagem 1"} className="w-[100%] h-[100%]"/>
                </div>
                <div className="flex items-center justify-center w-[42.5vw] h-[52.5vh] rounded-xl overflow-hidden">
                    <Image src={img2} alt={"Imagem 2"} className="w-[100%] h-[100%]"/>
                </div>
                <div className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mr-8 mt-8 overflow-hidden">
                    <Image src={img3} alt={"Imagem 3"} className="w-[100%] h-[100%]"/>
                </div>
                <div className="flex items-center justify-center bg-primary w-[42.5vw] h-[52.5vh] rounded-xl mt-8 overflow-hidden">
                    <Image src={img4} alt={"Imagem 3"} className="w-[100%] h-[100%]"/>
                </div>
            </div>
        </>
    )
}