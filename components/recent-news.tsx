"use client"

import Image from "next/image"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const newsData = [
    {
        date: "12 Jul 2025",
        category: "Disaster Relief",
        title: "Flood Relief Program Reaches Over 10,000 Families",
        img: "/recent.back.jpg",
    },
    {
        date: "5 Jul 2025",
        category: "Inclusive Education",
        title: "Launch of Special Education Initiative in Urban Areas",
        img: "/recent.back.jpg",
    },
    {
        date: "28 Jun 2025",
        category: "Women Empowerment",
        title: "Skill Training for 500 Women Completed Successfully",
        img: "/help1.jpg",
    },
    {
        date: "22 Jun 2025",
        category: "Healthcare",
        title: "Mobile Health Units Launched in Remote Villages",
        img: "/recent.back.jpg",
    },
    {
        date: "18 Jun 2025",
        category: "Child Welfare",
        title: "Nutrition Awareness Sessions Held in 20 Schools",
        img: "/recent.back.jpg",
    },
    {
        date: "29 Jul 2025",
        category: "Education",
        title: "New Educational Scheme Launched - Thousands of Children to Benefit",
        img: "/recent.back.jpg",
    },
    {
        date: "20 Jul 2023",
        category: "Health",
        title: "Free Medical Camps Setup Across Rural Areas",
        img: "/help3.png",
    },
    {
        date: "15 Jul 2025",
        category: "Employment",
        title: "New Employment Opportunities for Youth",
        img: "/recent.back.jpg",
    },
    {
        date: "10 Jul 2025",
        category: "Environment",
        title: "Tree Plantation Drive Completed in 100 Schools",
        img: "/recent.back.jpg",
    },
    {
        date: "8 Jul 2025",
        category: "Technology",
        title: "Digital Literacy Program Launched for Rural Youth",
        img: "/recent.back.jpg",
    },
]

export default function RecentNews() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -350 : 350,
                behavior: "smooth",
            })
        }
    }

    return (
        <section className="relative pb-16 overflow-hidden">
            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                    height: 0px;
                }
            `}</style>
            <div className="relative w-full h-[400px] px-4 md:px-16">
                <div className="w-full h-full overflow-hidden relative">
                    <Image
                        src="/recent-back.jpg"
                        alt="Background"
                        fill
                        className="object-cover custom-blur"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute top-8 left-8 z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
                            Recent News
                        </h2>
                        <div className="h-1 w-32 bg-yellow-400"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-20 -mt-56">
            <div className="flex justify-start ml-15 mb-6 gap-4 pl-6">
                <button
                    onClick={() => scroll("left")}
                    className="flex items-center justify-center bg-yellow-400 ml-10 shadow-md w-10 h-10 rounded-full hover:bg-yellow-300"
                    aria-label="Previous"
                >
                    <ChevronLeft className="text-white" />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="flex items-center justify-center bg-yellow-400 shadow-md w-10 h-10 rounded-full hover:bg-yellow-300"
                    aria-label="Next"
                >
                    <ChevronRight className="text-white" />
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 md:gap-8 overflow-x-auto px-1 hide-scrollbar scroll-smooth"
            >
                {newsData.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-500 mb-10 max-w-xs w-full flex-shrink-0 group rounded-lg"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                <span>{item.date}</span>
                                <span className="mx-2">•</span>
                                <span>{item.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                {item.title}
                            </h3>
                            <a
                                href="/signup"
                                className="text-[#0D6DB7] font-semibold hover:underline"
                            >
                                Read more
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </section >
    )
}
