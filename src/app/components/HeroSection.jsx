
import React from 'react'
import Image from "next/image"


const HeroSection = () => {
  return (
    <section className="lg:py-8 mb-10">
        <div className="flex flex-col items-center justify-center gap-8">
            <Image
                src="/images/Me.jpeg"
                alt="Jason Lin"
                priority
                sizes="(min-width: 1024px) 400px, 300px"
                className="rounded-full w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-cover object-[center_10%]"
                width={370}
                height={370}
            />
            <div className="lg:max-w-4xl max-w-2xl mx-auto text-xl font-medium text-center font-[Poppins] text-black">
                <p>
                    Hello, I&apos;m Jason Lin! I am currently a computer science undergraduate at the Henry Samueli School of Engineering & Applied Sciences at UCLA. <span className="text-decoration-line: underline">
                        I&apos;m passionate about software development, full-stack development, and AI/ML applications.</span> Lately, I’ve been diving deep into building AI agents using LangGraph
                        and exploring how they can automate workflows and make people&apos;s lives easier.
                    <br></br>
                    <br></br>
                    Right now, <span className="font-bold">I’m actively looking for internship opportunities</span> where I can apply my skills, learn from amazing teams, and contribute to impactful projects. Take a look at my projects and let’s connect!

                </p>
            </div>

        </div>
    </section>
  )
}

export default HeroSection
