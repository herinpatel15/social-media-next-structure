import { connectionToDatabase } from "@/lib/db"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const {email, password} = await req.json()
        if (!email || !password) {
            return NextResponse.json(
                {error: "Email and Password required"},
                {status: 400}
            )
        }
        
        await connectionToDatabase()

        // if(!conn) {
        //     return NextResponse.json({error: "Database connection failed"}, {status: 500})
        // }

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        await User.create({email, password})

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        )

    } catch(e) {
        console.log(e)
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}