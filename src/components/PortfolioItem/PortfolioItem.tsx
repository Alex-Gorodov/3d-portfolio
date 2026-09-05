import { Canvas } from "@react-three/fiber";
import Placeholder from "../Placeholder/Placeholder";

interface PortfolioItemProps {
  visible: boolean;
  name: string;
  url: string;
  image: string;
}

export default function PortfolioItem({
  visible,
  name,
  url,
  image,
}: PortfolioItemProps) {
  const isTouchDevice = navigator.maxTouchPoints > 0

  const getImageName = (image: string) => {
    switch (image) {
      case "Divesea":
        return "divesea";

      case "Intel security":
        return "intel";

      case "Check my projects":
        return "portfolio";

      case "Braga brewery":
        return "braga";

      default:
        return "";
    }
  }

  return (
    <div
      className={`
        side-item
        ${isTouchDevice ? "side-item--mobile" : ""}
        ${visible ? "side-item--visible" : ""}
      `}
    >
      <a className="side-item__wrapper" href={url} target="_blank">
        <div className="side-item__image-wrapper">
          {
            image ?
              <img
                className="side-item__image"
                src={`./images/${getImageName(image)}.png`}
                alt={name}
                width={573}
                height={355}
                loading="lazy"
              />
              :
              <Canvas
                camera={{ position: [0, 0, 2], zoom: 0.75 }}
                >
                  <mesh rotation-x={Math.PI / 5} rotation-y={Math.PI}>
                    <Placeholder/>
                  </mesh>
              </Canvas>
          }
        </div>

        <p className="side-item__name">{name}</p>
      </a>
    </div>
  );
}
