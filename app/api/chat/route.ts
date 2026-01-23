import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMsg = message.toLowerCase().trim();

    let botReply = "I didn't quite get that. Try asking for 'Remote Jobs' or 'Internships'.";
    let action = null;
    let searchQuery = "";

    // 🔥 1. JOB TRIGGERS (HIGHEST PRIORITY)
    // Pehle Job check karein taaki "Free"lance ko "Free" na samjhe
    if (lowerMsg.includes("remote") || lowerMsg.includes("wfh")) {
      botReply = "Showing you Remote jobs... 🏠";
      action = "search";
      searchQuery = "Remote";
    }
    else if (lowerMsg.includes("intern")) { 
      botReply = "Checking the latest Internships... 🎓";
      action = "search";
      searchQuery = "Internship";
    }
    else if (lowerMsg.includes("freelance") || lowerMsg.includes("contract")) {
      botReply = "Searching for Freelance gigs... 💻";
      action = "search";
      searchQuery = "Freelance";
    }
    else if (lowerMsg.includes("full time") || lowerMsg.includes("full-time")) {
      botReply = "Searching for Full-time roles... 🏢";
      action = "search";
      searchQuery = "Full Time";
    }
    else if (lowerMsg.includes("manager") || lowerMsg.includes("management")) {
      botReply = "Searching for Management roles... 👔";
      action = "search";
      searchQuery = "Manager";
    }

    // 🔥 2. CONVERSATION & SMALL TALK
    else {
        const greetings = ['hi', 'hello', 'hey', 'hola', 'namaste', 'yo', 'sup', 'greetings'];
        const howAreYou = ['how are you', 'how r u', 'wassup', 'whatsup', 'how is it going'];
        const farewells = ['bye', 'goodbye', 'cya', 'good night', 'tata', 'exit'];
        const gratitude = ['thanks', 'thank you', 'thx', 'cool', 'awesome', 'great'];
        const insults = ['hate you', 'stupid', 'dumb', 'idiot', 'useless', 'bad bot', 'fuck', 'shit'];
        const help = ['help', 'support', 'assist', 'guide'];

        if (greetings.some(g => lowerMsg === g || lowerMsg.startsWith(g + ' '))) {
          botReply = "Hello! 👋 I am FindMeWork AI. Ready to find your dream job? 🚀";
        }
        else if (howAreYou.some(h => lowerMsg.includes(h))) {
          botReply = "I'm just a bot, but I'm ready to help you get hired! ⚡ What job do you need?";
        }
        else if (farewells.some(f => lowerMsg.includes(f))) {
          botReply = "Goodbye! 👋 Good luck with your job hunt!";
        }
        else if (gratitude.some(g => lowerMsg.includes(g))) {
          botReply = "You're welcome! Let me know if you need more jobs. 💼";
        }
        else if (insults.some(i => lowerMsg.includes(i))) {
          botReply = "I'm sorry. 😔 I'm still learning. Try searching for a specific job like 'Python Developer'.";
        }
        else if (help.some(h => lowerMsg.includes(h))) {
          botReply = "Just type the job role you want. Examples:\n- 'Find React Jobs'\n- 'Remote Internships'";
        }
        // Strict "Free" check: Sirf tab bole jab wo 'freelance' na ho
        else if ((lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("free") || lowerMsg.includes("money")) && !lowerMsg.includes("freelance")) {
          botReply = "FindMeWork is 100% FREE for job seekers! No hidden charges. 💸";
        }
        
        // 🔥 3. EXPLICIT SEARCH ("Find X")
        else if (
          lowerMsg.startsWith("find") || 
          lowerMsg.startsWith("search") || 
          lowerMsg.includes("looking for") ||
          lowerMsg.includes("show me")
        ) {
          searchQuery = lowerMsg
            .replace(/find|search|looking for|show me|jobs|job|vacancies|for/g, "")
            .trim();

          if (searchQuery.length > 1) {
            botReply = `Searching for "${searchQuery}"... 🔍`;
            action = "search";
          } else {
            botReply = "Please specify the job role. (e.g., 'Find Designer')";
          }
        }

        // 🔥 4. IMPLICIT SEARCH (Smart Fallback)
        else {
           const stopWords = ['why', 'what', 'where', 'when', 'how', 'ok', 'okay', 'yes', 'no', 'sure', 'lol', 'haha'];
           
           if (!stopWords.some(w => lowerMsg === w)) {
             if (lowerMsg.length < 40) {
                botReply = `Searching for "${message}" jobs... 🚀`;
                action = "search";
                searchQuery = message;
             } else {
                botReply = "I can only help with Job Searches. Try typing a job title like 'Java Developer'.";
             }
           } else {
             botReply = "Tell me a job title you are interested in! (e.g., 'Designer')";
           }
        }
    }

    return NextResponse.json({ reply: botReply, action, query: searchQuery });

  } catch (error) {
    return NextResponse.json({ reply: "System Error. Please try again." }, { status: 500 });
  }
}