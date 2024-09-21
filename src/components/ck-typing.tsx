import TypingAnimation from "@/components/magicui/typing-animation";

export function CubingKeralaTyping() {
  return (
    <div className="flex items-center justify-start md:justify-center">
      <TypingAnimation
        className="font-semibold font-mono text-lg md:text-2xl text-green-500"
        text="Cubing Kerala,"
      />
    </div>
  );
}
