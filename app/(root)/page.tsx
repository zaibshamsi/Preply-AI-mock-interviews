import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser, getInterviewByUserId, getLatestInterviews} from "@/lib/actions/auth.action";

const page = async () => {
    const user = await getCurrentUser();

    const [userInterviews,latestInterviews] = await Promise.all([
        await getInterviewByUserId(user?.id!),
        await getLatestInterviews({ userId: user?.id!})
    ]);

    const hasPastInterviews = userInterviews?.length > 0;
    const  hasUpcomingInterviews = latestInterviews?.length > 0;

    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI powered Practice and feedback</h2>
                    <p className="text-lg">
                        Practice on real interview questions & get instant
                        feedback
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>
                <Image src="/robot.png" alt="robot-guy" width={400} height={400}
                       className="max-sm:hidden"/>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your interviews</h2>

                <div className="interviews-section">
                    {
                        hasPastInterviews ? (
                            userInterviews?.map((interview) => (
                        <InterviewCard {...interview} key={interview.id}/>

                            ))) : ( <p> You have'nt taken any interviews yet</p>)
                    }
                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>

                <div className="interviews-section">
                    {
                        hasUpcomingInterviews ? (
                            latestInterviews?.map((interview) => (
                                <InterviewCard {...interview} key={interview.id}/>

                            ))) : ( <p> There are no new interviews yet</p>)
                    }
                </div>
            </section>
        </>

    )
}
export default page