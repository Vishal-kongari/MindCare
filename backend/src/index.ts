import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";
import twilio from "twilio";
import serviceAccount from "./serviceAccountKey.json";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- FIREBASE SETUP ----------------
try {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		});
	}
} catch (err) {
	console.error("Failed to initialize Firebase Admin:", err);
}
const db = admin.firestore();

// ---------------- TWILIO SETUP ----------------
const twilioSid = process.env.TWILIO_SID ?? "";
const twilioAuth = process.env.TWILIO_AUTH ?? "";
const twilioNumber = process.env.TWILIO_NUMBER ?? "";
const client = twilio(twilioSid, twilioAuth);

async function makeCall(phoneNumber: string) {
	if (!twilioSid || !twilioAuth || !twilioNumber) {
		console.warn("Twilio credentials not configured; skipping call.");
		return;
	}
	try {
		await client.calls.create({
			url: "http://demo.twilio.com/docs/voice.xml",
			to: phoneNumber,
			from: twilioNumber,
		});
		console.log("📞 Call triggered to:", phoneNumber);
	} catch (err) {
		console.error("❌ Error making call:", err);
	}
}

// ---------------- GEMINI SETUP ----------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// ---------------- TRIGGER WORDS ----------------
const triggerWords = [
	"i am done",
	"i give up",
	"suicidal",
	"kill myself",
	"hopeless",
	"end my life",
	"depressed",
	"can't go on",
	"worthless",
	"want to die",
	"i hate my life",
];

function containsTriggerWord(message: string) {
	const msg = message.toLowerCase();
	return triggerWords.some((word) => msg.includes(word));
}

// ---------------- HYBRID CHECK ----------------
async function isEmotionallyWeak(userMessage: string) {
	if (containsTriggerWord(userMessage)) return true;
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const prompt = `Determine if the following text shows emotional distress or suicidal intent.\nReply with only \"YES\" or \"NO\".\nText: "${userMessage}"`;
		const result = await model.generateContent(prompt);
		const responseText = result.response.text().trim().toUpperCase();
		return responseText === "YES";
	} catch (err) {
		console.error("Error in Gemini check:", err);
		return false;
	}
}

// ---------------- CHAT ENDPOINT ----------------
// ---------------- CHAT ENDPOINT ----------------
app.post("/api/chat", async (req, res) => {
	try {
		const { userMessage, userId } = req.body as { userMessage: string; userId: string }; // userId might be optional in frontend atm, assume handled
		if (!userMessage) return res.status(400).json({ error: "userMessage is required" });

		const weak = await isEmotionallyWeak(userMessage);

		if (weak) {
			try {
				// If userId is provided, look up user. If not, we might need another way or just skip call.
				// For now, if userId is missing, skip DB lookup to avoid crash, but return distress message.
				if (userId) {
					const userRef = db.collection("users").doc(userId);
					const doc = await userRef.get();
					if (doc.exists) {
						const data = doc.data() as { phone?: string };
						if (data?.phone) await makeCall(data.phone);
					}
				}
			} catch (err) {
				console.error("Firestore lookup failed:", err);
			}
			return res.json({
				reply:
					"🚨 We noticed signs of distress. We've alerted your emergency contact for support. 💙",
				distress: true
			});
		}

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const result = await model.generateContent(userMessage);
		return res.json({ reply: result.response.text() });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Something went wrong" });
	}
});

// ---------------- EMERGENCY ENDPOINTS ----------------
app.post("/api/emergency-sms", async (req, res) => {
	// Placeholder for SMS logic
	console.log("SMS requested:", req.body);
	// In a real app, use Twilio here similar to makeCall
	res.json({ success: true, message: "SMS alert logged (simulation)" });
});

app.post("/api/emergency-email", async (req, res) => {
	// Placeholder for Email logic
	console.log("Email requested:", req.body);
	// In a real app, use Nodemailer or Firebase extensions
	res.json({ success: true, message: "Email alert logged (simulation)" });
});

app.post("/api/emergency-call", async (req, res) => {
	// Re-using logic or just proxying to makeCall if specific phone passed
	const { to, studentName } = req.body;
	if (to) await makeCall(to);
	res.json({ success: true });
});

// ---------------- HEALTH + START ----------------
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


