import Image from 'next/image'

export default function BearScene() {
  return (
    <div className="animate-float w-full max-w-xs sm:max-w-sm mx-auto select-none">
      <Image
        src="/bear-portrait.png"
        alt="A rustic bear resting in a sun-drenched woodland clearing, with a tiny duck nestled in its fur"
        width={932}
        height={860}
        className="w-full h-auto rounded-2xl"
        priority
        draggable={false}
      />
    </div>
  )
}
