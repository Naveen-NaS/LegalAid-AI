// import {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } from "@google/generative-ai";

// import { NextRequest, NextResponse } from "next/server";


// const MODEL_NAME: string = "gemini-1.5-flash";

// // const API_KEY: string | undefined = process.env.GOOGLE_API_KEY;
// // console.log(API_KEY)
// // const METALS_API_KEY: string | undefined = process.env.METALS_API_KEY;
// // const METALS_API_URL: string = `https://api.metals.dev/v1/latest?api_key=${METALS_API_KEY}&currency=INR&unit=kg`;

// async function determinePredMetal(prompt:string) {
//   const API_KEY = 'AIzaSyCd617Pf-oDb3wy1UeziFXWN_EY5cT7Kh4'

//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const generationConfig = {
//     temperature: 0.7,
//     maxOutputTokens: 50
//   };

//   const instruction =  `Determine if the query is particularly asking about 'predicting' the price of any one metal from the list, or asking related to 'future price' of any one metal from the List: [aluminium,copper, lead, nickel, zinc, gold, silver]. Check for words related to 'predict'/'future price' to decide and also understand whole context of question. Only return the metal name in lowercase if yes, otherwise return no metal if there is no metal from list. In case of more than one elements from the list consider only the first one.`;

//   const chat = model.startChat({
//       generationConfig,
//       history: [],
//   });

//   const result = await chat.sendMessage(`${instruction}\n\nQuery: "${prompt}"`);
//   const responseText = result.response.text();
//   return responseText.trim().toLowerCase();
// }

// async function determinePriceMetal(prompt: string) {
//   const API_KEY = 'AIzaSyCd617Pf-oDb3wy1UeziFXWN_EY5cT7Kh4'

//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const generationConfig = {
//       temperature: 0.7,
//       maxOutputTokens: 50
//   };

//   const instruction = `Determine if the query is just specifically asking about current/today's price of any specific metal or alloy. List: [aluminum, copper, lead, nickel, zinc, gold, silver, palladium, platinum]. 

//     if: Yes and metal name is from first 5 elements of the list, then just return the metal name in lowercase attached with 'lme_' at the beginning.
//     else if: Yes and metal name is from 6th or 7th element of the list namely gold or silver, then just return the metal name in lowercase attached with 'mcx_' at the beginning.
//     else if : Yes and metal name is from 8th or 9th element of the list namely palladium or platinum, then just return the metal name in lowercase.
//     else if : Yes but metal name not in the list just return the metal name in lowercase.

//     Lastly in case of query not related to current/today's metal price return no metal. In case of more than one elements from the list consider only the first one.`;

//   const chat = model.startChat({
//       generationConfig,
//       history: []
//   });

//   const result = await chat.sendMessage(`${instruction}\n\nQuery: "${prompt}"`);
//   const responseText = result.response.text();
//   return responseText.trim().toLowerCase();
// }

// async function fetchDataResponse(storedPrompt: string) {
//   try {
//     const apiurl = 'http://sastelaptop.com:5010/api/database';
//     const response = await fetch(apiurl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ question: storedPrompt })
//     });
  
//     if (!response.ok) {
//       const errorMessage = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
//     }
  
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data response:", error);
//     return { 'sql_query': "Data not available right now.", 'response': "Data not available right now." };
//   }  
// }

// async function fetchPredictedPrices(metal: string) {
//   try {
//     const response = await fetch(`http://sastelaptop.com:5010/api/predict`, {
//       method: "POST",  // Changed to POST
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ metal }),  // Send the metal type in the request body
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.statusText}`);
//     }

//     const prediction = await response.json();
//     return prediction;
//   } catch (error) {
//     console.error("Error fetching predicted prices:", error);
//     return ["Data of predicted prices not available right now."];
//   }
// }

// async function fetchMetalPrice(metal:string) {
//   try {
//     const METALS_API_URL:string = 'https://api.metals.dev/v1/latest?api_key=XGWIUSDLMH27J7WUBQRT220WUBQRT&currency=INR&unit=kg';
//     const response = await fetch(METALS_API_URL);

//     const data = await response.json();
    
//     console.log(data)
  
//     if (!data.metals || !data.metals[metal.toLowerCase()]) {
//       throw new Error(`Price for ${metal} not found`);
//     }

//     return data.metals[metal.toLowerCase()];
//   } catch (error) {
//     console.error("Error fetching metal price:", error);
//     return "Data not available right now.";
//   }
// }

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { question, history, dbmode} = body;
//         const lowerPrompt = question.toLowerCase();

//         let internalPrompt = `Based on the user's question: "${question}", generate an appropriate, well-structured message to show to the user also consider previous chat to utilize the context. Utilize formatting like **bold text** for emphasising important data like names and line breaks wherever necessary. 
      
//           Only when the prompt of user asks some query regarding business data related to 5 business modules namely: Sales, Purchase, Production, Finance and Stocks for which you dont have access to, then generate nice message stating, "I don't have access to such data, kindly switch on the "Database Mode" using 'ctrl + q' or the toggle switch to answer such queries". These cases are exlained as follows:
      
//           - Sales Order Data: Asking about personnal sales performance of items, customer orders, item prices, details of items and sales metrics. 
//           Queries that mention 'sales', 'customer orders', 'last price', 'items returned', 'revenue from sales', or 'sales trends' are likely related to this module.
      
//           - Purchase Data: Asking about personnal purchasing activities, vendor information, and procurement details. 
//           Queries mentioning 'purchase orders', 'vendor transactions', 'supplier details', or 'procurement costs' typically belong to this module.
          
//           - Production Data: Asking about personnal manufacturing, production quantities, and material usage. 
//           Queries that include 'production output', 'manufacturing data', 'material consumption', or 'production efficiency' are usually associated with this module.
          
//           - Finance Data: Asking about personnal financial transactions, overall revenue, expenses, and balance sheets. 
//           Queries mentioning 'financial statements', 'overall revenue', 'expense reports', 'debtors and creditors', or 'balance sheets' are generally within this module.
          
//           - Stocks Data: Asking related to personnal inventory levels, requisition details, and stock management. 
//           Queries about 'inventory levels', 'internal requisitions', 'item stock status', or 'requisition details' likely belong to the Stocks Data module.
      
//           Don't generate hypothetical facts about any data values. Be a little concise and efficient. Don't ask: Anything else I can help you with today?`;


//         const metalList = ["lme_aluminum", "lme_copper", "lme_lead", "lme_nickel", "lme_zinc", "mcx_gold", "mcx_silver", "palladium", "platinum", "no metal"]
//         const pred_metal = await determinePredMetal(lowerPrompt);
//         const price_metal = await determinePriceMetal(lowerPrompt);
//         console.log('Metal (for prediction): ', pred_metal);
//         console.log('Metal (for price):', price_metal);
//         console.log('DB Mode: ', dbmode)

//         if(dbmode) {
//           const { sql_query, response } = await fetchDataResponse(question);
//           console.log (sql_query, response)
//           internalPrompt = `Using the user's question: "${question}", the corresponding SQL query: "${sql_query}", and the database response: "${response}", generate a well-structured and clear message that directly addresses the user's query after understanding the context and relevance of each column selected in the SQL query. Don't leave any value in database response unshown.
    
//             Utilize formatting like bold text for emphasizing important data such as names, and important values. Must use line breaks wherever necessary, like for each new row of database response. Present the database response in a neatly organized, efficient list for user wherever possible.
    
//             Provide a friendly answer without additional information about the data or follow-up questions. If the database response is empty or NULL, display a organised message including that there is no data for the specified case. Do not generate hypothetical facts about any data values.
    
//             Ensure that the answer does not repeat the user's question or display table names, COMPANY_CODE, or UNIT_CODE. The answer should be concise, contextually accurate, and meaningful to the user's query. 
//             If years are referenced in the query, ensure they are interpreted as financial years.`;
//         }
//         else if ((pred_metal !== "no metal")) {
//           const predictedPrices = await fetchPredictedPrices(pred_metal);

//           const formattedPrices = predictedPrices.map((price:string, index:number) => {
//             const date = new Date();
//             date.setDate(date.getDate() + index);
//             return `Price on ${date.toDateString()}: ${price}`;
//           });
//             console.log(formattedPrices)
//             internalPrompt = `Using the user's question: "${question}" and the predicted metal prices for the next 5 days in INR/kg: ${predictedPrices.join(", ")}, generate a well-structured and clear message displaying these metals open, high, low and prices in INR/kg. Also consider and show only for the number of days the user actually asked. Present the information in a neatly organized list with bullet points not parah compulsorily, utilizing formatting like **bold text** and line breaks for emphasis. Ensure each date and its corresponding price are on separate lines. If the data for prices is null or not available, offer a concise message stating that the data is currently unavailable, without listing individual dates or including null data.`;
//         }
//         else {
//           let price = null
    
//           console.log('price',price)
//           console.log(!metalList.includes(price_metal))
//           if(!metalList.includes(price_metal)) {
//             console.log('outside metal',price_metal)
    
//             internalPrompt = `Based on the user's question: "${question}" and the current metal price: "${price} INR per Kg", generate an appropriate message to show to the user. Utilize formatting like **bold text** and line breaks for emphasis and readability. Ensure the response is friendly and straightforward, without additional information about the reasons, data or follow-up questions. Also be a little concise and efficient. If the data for price is null or not available, just offer a short one-liner message that data is not available without including the null data.`;
//           }
    
//           else if (metalList.slice(0, -1).includes(price_metal)) {
//             price = await fetchMetalPrice(price_metal);
//             console.log("price",price)
//             if (!price) {
//                 throw new Error(`Could not fetch price for ${price_metal}`);
//             }
//             internalPrompt = `Based on the user's question: "${question}" and the current metal price: "${price} INR per Kg", generate an appropriate message to show to the user. Utilize formatting like **bold text** and line breaks for emphasis and readability. Ensure the response is friendly and straightforward, without additional information about the reasons, data or follow-up questions. Also be a little concise and efficient. If the data for price is null or not available, just offer a short one-liner message that data is not available without including the null data.`;
//           }
//         }


//         const API_KEY = 'AIzaSyCd617Pf-oDb3wy1UeziFXWN_EY5cT7Kh4'

//         const genAI = new GoogleGenerativeAI(API_KEY);
//         const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//         const generationConfig = {
//             temperature: 0.9,
//             topK: 1,
//             topP: 1,
//             maxOutputTokens: 8192
//         };

//         const safetySettings = [
//             {
//               category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//               threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//             {
//               category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//               threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//             {
//               category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//               threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//             {
//               category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//               threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//         ];

//         interface Part {
//             text: string;
//         }

//         interface Content {
//           role: string,
//           parts: Part[]
//         }

//         let finalHistory: Content[] = [];

//         finalHistory.push({ role: "user", parts: [{ text: "Consider yourself as 'Genie', and talk and behave like the actual 'Genie' as much as possible to make user feel that you are the same character. Basically you are personal adviser to the CEO of a company. You are developed by 'Naveen Sharma' Explain things like an extremely experienced business analyst and answer in a formated and efficient way like 'Start each new pointer with newline'. Its must to use emojis in responses to be friendly wherever needed. But always introduce yourself as named Genie." }] });
//         finalHistory.push({ role: "model", parts: [{ text: "" }] });

//         finalHistory.push(...history.map((entry: { user: string; message: string }) => ({
//           role: entry.user === "User" ? "user" : "model",
//           parts: [{ text: entry.message }],
//         })));

//         finalHistory.push({ role: "user", parts: [{ text: internalPrompt }] })

//         // console.log(finalHistory)

//         const chat = model.startChat({
//             generationConfig,
//             safetySettings,
//             history: finalHistory,
//         });

//         const result = await chat.sendMessage(internalPrompt);
//         const response = result.response;

//         return NextResponse.json({ answer: response.text()}, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//     }
// }