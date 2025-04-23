import express from "express";
import {createClient} from '@supabase/supabase-js';

const router = express.Router();

//initialize supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl,supabaseKey);

router.post('/signup', async(req, res) => {
    try{
        const {email,password,username} = req.body;

        if(!email || !password || !username){
            return res.status(400).json({error:"Email,password and username are required"})
        }

        const {data , error} = await supabase.auth.signUp({
            email,
            password,
            options:{
                data:{
                    username,
                },
            },
        });

        if(error){
            return res.status(400).json({error: error.message});
        }

        const {error:profileError} = await supabase
            .from('Profiles')
            .insert({
                id:data.user.id,
                username,
                email,
                created_at:new Date(),
            });
        if(profileError){
            console.error("Error creating profile:", profileError);
        }

        return res.status(201).json({
            message:'Account created successfully',
            user:data.user,
        });
    }
    catch(error){
        console.error("Server error",error);
        return res.status(500).json({error: "Internal server error"});
    }
});

router.post('/signin', async(req, res) => {
    try{
        const{email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: "Email and password required"});

        }
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error){
            return res.status(400).json({error: error.message});
        }

        return res.status(200).json({
            message:"Sign in successful",
            user: data.user,
            session: data.session,
        });
    }
    catch(error){
        console.error("Server error");
        return res.status(500).json({error: "Internal server error"});
    }
});

export {router as authRouter};