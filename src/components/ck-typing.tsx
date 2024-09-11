import TypingAnimation from "@/components/magicui/typing-animation";
import LottieComponent from "./lottie";

export function CubingKeralaTyping() {
  return (
    <div className="flex items-center justify-start -ml-1">
      <div className="w-7 md:w-10"><LottieComponent path="/rounds-spinning.json" /></div>
      <TypingAnimation
        className="font-mono font-normal text-lg md:text-2xl text-green-500"
        text="Cubing Kerala,"
      />
    </div>
  );
}
