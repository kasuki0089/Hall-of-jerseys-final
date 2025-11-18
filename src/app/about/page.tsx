import MainTemplate from "@/templates/MainTemplate/Index";
import { MapPin, MapPinned, MessageSquare, SquareCheckBig } from "lucide-react";

export const metadata = {
  title: "Sobre - Hall Of Jerseys",
  description: "Saiba mais sobre nossa empresa.",
};



export default function AboutPage(){
    return(
        <>
            <MainTemplate>
                <section className="bg-black w-full h-[85vh] py-30 pl-30 ">
                    <h1 className="w-[80%] text-white text-[8rem] leading-none font-bold">VESTINDO AS RUAS COM A MODA ESPORTIVA AMERICANA</h1>
                    <h1 className="text-white text-[3rem] mt-6.5">Conheça mais sobre nós!</h1>
                </section>
                <section className="w-full h-[70vh] flex items-center justify-center">
                    <div className="w-[40vh] h-[40vh] bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
                        <MessageSquare size={125} color="#12a0ff"/>
                        <h1 className="text-[1.65rem] mt-5">Suporte 24h</h1>
                    </div>
                    <div className="w-[50vh] h-[50vh] ml-[5vw] mr-[5vw] bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
                        <SquareCheckBig size={150} color="#12a0ff" />
                        <h1 className="text-[1.65rem] w-[75%] text-center mt-5">Alta qualidade dos nossos produtos</h1>
                    </div>
                    <div className="w-[40vh] h-[40vh] bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
                        <MapPin size={125} color="#12a0ff" />
                        <h1 className="text-[1.65rem] w-[75%] text-center mt-5">Entregas para todo Brasil</h1>
                    </div>
                </section>
                <section className="bg-primary w-full h-[65vh] flex items-center justify-center">
                    <MapPinned size={275} color="#EFBF04" />
                    <div className="w-auto h-auto ml-20">
                        <h1 className="text-[6.5rem] text-white">Shopping Morumbi</h1>
                        <h1 className="text-[2.5rem] text-white">Seg. à Sex. das 07h até as 22h</h1>
                    </div>
                </section>
                <section>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7310.748320002345!2d-46.70487731232626!3d-23.626767858376947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50c4a726aaab%3A0xa6b37701be082ac8!2sMorumbi%20Shopping!5e0!3m2!1spt-BR!2sbr!4v1761857106108!5m2!1spt-BR!2sbr" width="100%" height="600"></iframe>
                </section>
            </MainTemplate>
        </>
    )
}