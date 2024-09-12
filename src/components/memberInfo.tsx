'use client'

import { CompetitorData, RequestInfo } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import '@cubing/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from 'next/image'

const MemberInfoComponent = ({ member, memberResult }: { member: RequestInfo, memberResult: CompetitorData }) => {

    const [currentMember, setCurrentMember] = useState<RequestInfo>(member)
    const [currentMemberResult, setCurrentMemberResult] = useState<CompetitorData>(memberResult)

    useEffect(() => {
        if (member) {
            setCurrentMember(member)
        }
        if (memberResult) {
            setCurrentMemberResult(memberResult)
        }
    }, [member, memberResult])

    const personalRecordsArray = Object.entries(currentMemberResult.personal_records).map(([event, ranking]) => ({
        event,
        ranking
    }));

    // console.log(personalRecordsArray);
    // console.log(currentMember);



    function convertMillisecondsToTime(milliseconds: number) {
        if (milliseconds < 0) {
            return 'DNF';
        }

        let totalSeconds = milliseconds / 100;

        if (totalSeconds < 60) {
            return totalSeconds.toFixed(2);
        } else {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = (totalSeconds % 60).toFixed(2);
            if (Number(seconds) < 10) {
                return `${minutes}.0${seconds}`;
            }
            return `${minutes}.${seconds}`;
        }
    }


    function convertMbldToMinutes(number: number): string {
        const numStr = `0${number.toString()}`;

        const DD = parseInt(numStr.substring(1, 3), 10);
        const TTTTT = parseInt(numStr.substring(3, 8), 10);
        const MM = parseInt(numStr.substring(8, 10), 10);

        const difference = 99 - DD;
        const missed = MM;
        const solved = difference + missed;
        const attempted = solved + missed;

        const totalSeconds = TTTTT;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const timeFormatted = `${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;

        const finalOutput = `${solved}/${attempted} ${timeFormatted}`;
        return finalOutput;
    }


    return (
        <div className="min-h-screen bg-black text-stone-200">
            <main className="flex flex-col items-center p-4 cursor-default">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">{currentMember.name}</h2>
                    <Badge className='rounded-none bg-neutral-800 hover:bg-neutral-800 text-stone-200 border-none' variant="secondary">Cubing Kerala {(currentMember.role).split('')[0].toUpperCase() + (currentMember.role).slice(1)} </Badge>
                </div>
                <div className="w-full max-w-[200px] h-[200px] my-4">
                    <Avatar className="w-full h-full rounded-md">
                        <AvatarImage className='object-cover' src={currentMember.avatarUrl.includes("missing_avatar_thumb") ? "/user.png" : currentMember.avatarUrl} alt="Profile Picture" />
                        <AvatarFallback className='rounded-md bg-neutral-900 text-stone-200'>{currentMember.name}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex justify-center space-x-8 my-4">
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">COUNTRY</p>
                        <p className='text-sm font-semibold'>{(currentMember.country).toUpperCase()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">WCA ID</p>
                        <p className='text-sm font-semibold'>{currentMember.wcaid}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">COMPETITIONS</p>
                        <p className='text-sm font-semibold'>{currentMemberResult.competition_count}</p>
                    </div>
                </div>
                <div className="flex justify-center space-x-8 my-2">
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">MEDALS</p>
                        <div className='flex justify-center space-x-2'>
                            <div className='flex justify-center items-center'>
                                <p className='text-sm font-semibold'>{currentMemberResult.medals.gold}</p>
                                <Image width={100} height={100} src="/gold.png" alt="gold" className='w-6 h-6' />
                            </div>
                            <div className='flex items-center justify-center'>
                                <p className='text-sm font-semibold'>{currentMemberResult.medals.silver}</p>
                                <Image width={100} height={100} src="/silver.png" alt="silver" className='w-6 h-6' />
                            </div>
                            <div className='flex items-center justify-center'><p className='text-sm font-semibold'>{currentMemberResult.medals.bronze}</p>
                                <Image width={100} height={100} src="/bronze.png" alt="bronze" className='w-6 h-6' /></div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-4xl mt-5">
                    <Table>
                        <TableHeader>
                            <TableRow className='hover:bg-neutral-900 border-none'>
                                <TableHead className='text-neutral-500'>Event</TableHead>
                                <TableHead className='text-neutral-500'>NR</TableHead>
                                <TableHead className='text-neutral-500'>CR</TableHead>
                                <TableHead className='text-neutral-500'>WR</TableHead>
                                <TableHead className='text-neutral-500'>Best</TableHead>
                                <TableHead className='text-neutral-500'>Average</TableHead>
                                <TableHead className='text-neutral-500'>WR</TableHead>
                                <TableHead className='text-neutral-500'>CR</TableHead>
                                <TableHead className='text-neutral-500'>NR</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                personalRecordsArray.map((event, index) => (
                                    <TableRow className='hover:bg-neutral-900 border-none' key={index}>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className={`cubing-icon event-${event.event}`}></span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='bg-green-400 text-black'>
                                                        <p>{event.event}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>

                                        {/* Single Rankings */}
                                        <TableCell>{event.ranking?.single?.country_rank ?? null}</TableCell>
                                        <TableCell>{event.ranking?.single?.continent_rank ?? null}</TableCell>
                                        <TableCell>{event.ranking?.single?.world_rank ?? null}</TableCell>

                                        {/* Single Best Time */}
                                        <TableCell className='font-semibold'>
                                            {event.ranking?.single?.best
                                                ? event.event === '333mbf'
                                                    ? convertMbldToMinutes(event.ranking.single.best)
                                                    : event.event === '333fm' ? (event.ranking.single.best)
                                                        : convertMillisecondsToTime(event.ranking.single.best)
                                                : null}
                                        </TableCell>

                                        {/* Average Rankings */}
                                        <TableCell className='font-semibold pl-5'>
                                            {event.ranking?.average?.best
                                                ? event.event !== '333mbf'
                                                    ? convertMillisecondsToTime(event.ranking.average.best)
                                                    : null
                                                : null}
                                        </TableCell>
                                        <TableCell>{event.ranking?.average?.world_rank ?? null}</TableCell>
                                        <TableCell>{event.ranking?.average?.continent_rank ?? null}</TableCell>
                                        <TableCell>{event.ranking?.average?.country_rank ?? null}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    )
}

export default MemberInfoComponent


function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    )
}


function CuboidIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z" />
            <path d="M10 22v-8L2.25 9.15" />
            <path d="m10 14 11.77-6.87" />
        </svg>
    )
}


function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    )
}


function GroupIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 7V5c0-1.1.9-2 2-2h2" />
            <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
            <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
            <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
            <rect width="7" height="5" x="7" y="7" rx="1" />
            <rect width="7" height="5" x="10" y="12" rx="1" />
        </svg>
    )
}


function ListOrderedIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="10" x2="21" y1="6" y2="6" />
            <line x1="10" x2="21" y1="12" y2="12" />
            <line x1="10" x2="21" y1="18" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
    )
}


function LogInIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
    )
}
