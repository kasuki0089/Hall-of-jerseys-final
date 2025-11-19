import BestSellers from "../components/BestSellers";
import Carousel from "../components/Carousel";
import Galery from "../components/Galery";
import MainTemplate from "../templates/MainTemplate/index";

export default function Home() {
  return (
    <MainTemplate>
      <Carousel />
      <BestSellers />
      <Galery />
    </MainTemplate>
  );
}
