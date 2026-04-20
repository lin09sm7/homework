import { Composition } from "remotion";
import { HospitalRegDemo } from "./HospitalRegDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HospitalRegDemo"
      component={HospitalRegDemo}
      durationInFrames={900}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
