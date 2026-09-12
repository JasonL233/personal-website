"use client"
import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";

const EmailSection = () => {

    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
        }
        const JSONdata = JSON.stringify(data);
        const endpoint = "/api/send";

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSONdata,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            console.log("Message sent successfully:", resData);
            setEmailSubmitted(true);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }


    return (
    <section id="contact" className="grid md:grid-cols-2 my-12 md:my-12 py-18 gap-4 relative">
        <div className="z-10">
            <h3 className="text-2xl font-bold text-black my-2">
                Let's Connect!
            </h3>
            <p className="text-[#333333] mb-4 max-w-md">
                {" "}
                If you have any questions, feel free to reach out to me!
            </p>
            <div className="socials flex flex-row gap-2">
                <Link href="mailto:Lin1jason8@outlook.com">
                    <Image src="/email.svg" alt="Email Icon" width={45} height={45} className="hover:scale-110 transition-transform" />
                </Link>
                <Link href="https://github.com/JasonL233">
                    <Image src="/github.svg" alt="Github Icon" width={45} height={45} className="hover:scale-110 transition-transform" />
                </Link>
                <Link href="https://www.linkedin.com/in/jason-lin-b66b77226">
                    <Image src="/linkedin.svg" alt="Linkedin Icon" width={45} height={45} className="hover:scale-110 transition-transform" />
                </Link>
            </div>
        </div>

        <div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="email" type="email" className="text-black block mb-2 text-sm font-medium ">Your email</label>
                    <input name="email" type="email" id="email" required className="site-surface border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5" placeholder="helloWorld@gmail.com"/>
                </div>

                <div className="mb-6">
                    <label htmlFor="subject" type="subject" className="text-black block mb-2 text-sm font-medium ">Subject</label>
                    <input name="subject" type="text" id="subject" required className="site-surface border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5" placeholder="Just saying hi"/>
                </div>

                <div className="mb-6">
                    <label htmlFor="message" className="text-black block text-sm mb-2 font-medium">
                        Message
                    </label>
                    <textarea name="message" id="message" className="site-surface border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5" placeholder="Let's talk about...">
                    </textarea>
                </div>
                <button type="submit" className="bg-black hover:cursor-pointer text-white font-medium py-2.5 px-5 rounded-lg w-full">Send Message</button>
                {
                    emailSubmitted && (
                        <p className="text-green-500 text-sm mt-2">
                            Email set successfully!
                        </p>
                    )
                }
            </form>
        </div>
    </section>
    )
}

export default EmailSection
