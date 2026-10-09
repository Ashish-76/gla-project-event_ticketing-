require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");

// Models
const User = require("./Backend Configuration/Models/UserSchema/user");
const Role = require("./Backend Configuration/Models/RoleSchema/role");
const Event = require("./Backend Configuration/Models/EventSchema/event");
const Booking = require("./Backend Configuration/Models/BookingSchema/booking");
const Ticket = require("./Backend Configuration/Models/TicketSchema/ticket");
const Payment = require("./Backend Configuration/Models/PaymentSchema/payment");
const ActivityLog = require("./Backend Configuration/Models/ActivityLogSchema/activityLog");
const Setting = require("./Backend Configuration/Models/SettingSchema/setting");

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB for seeding...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/event_ticketing");
        console.log("Connected to MongoDB.");

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Role.deleteMany({}),
            Event.deleteMany({}),
            Booking.deleteMany({}),
            Ticket.deleteMany({}),
            Payment.deleteMany({}),
            ActivityLog.deleteMany({}),
            Setting.deleteMany({})
        ]);
        console.log("Cleared existing collections.");

        // 1. Seed Roles
        const roles = await Role.create([
            {
                name: "attendee",
                displayName: "Ticket Attendee",
                description: "Can explore events, book tickets, view printable digital QR passes, and manage registrations.",
                permissions: ["browse_events", "book_tickets", "view_my_tickets", "cancel_own_booking"]
            },
            {
                name: "organizer",
                displayName: "Event Organizer",
                description: "Can create and manage events, view ticket sales, and scan QR codes at venue gates.",
                permissions: ["create_events", "edit_own_events", "delete_own_events", "view_event_sales", "scan_qr_tickets", "view_attendee_roster"]
            },
            {
                name: "admin",
                displayName: "Platform Administrator",
                description: "Full access to platform statistics, user management, event moderation, global bookings, and system logs.",
                permissions: ["manage_users", "manage_events", "view_platform_analytics", "manage_settings", "audit_logs", "moderate_content"]
            }
        ]);

        // 2. Seed Users with Indian Names
        const passwordHashAdmin = await bcrypt.hash("admin123", 12);
        const passwordHashOrg = await bcrypt.hash("organizer123", 12);
        const passwordHashAtt = await bcrypt.hash("attendee123", 12);
        const passwordHashKeshav = await bcrypt.hash("keshav123", 12);
        const passwordHashVanshika = await bcrypt.hash("vanshika123", 12);

        const adminUser = await User.create({
            name: "Rahul Sharma (Admin)",
            email: "admin@eventix.com",
            passwordHash: passwordHashAdmin,
            phone: "+91 9389849873",
            role: "admin",
            profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            isActive: true
        });

        const organizerUser = await User.create({
            name: "Mohit Verma (Organizer)",
            email: "organizer@eventix.com",
            passwordHash: passwordHashOrg,
            phone: "+91 9389849873",
            role: "organizer",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            isActive: true
        });

        const attendeeRam = await User.create({
            name: "Ram Kumar",
            email: "attendee@eventix.com",
            passwordHash: passwordHashAtt,
            phone: "+91 9389849873",
            role: "attendee",
            profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            isActive: true
        });

        const attendeeKeshav = await User.create({
            name: "Keshav Gupta",
            email: "keshav@eventix.com",
            passwordHash: passwordHashKeshav,
            phone: "+91 9389849873",
            role: "attendee",
            profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
            isActive: true
        });

        const attendeeVanshika = await User.create({
            name: "Vanshika Singh",
            email: "vanshika@eventix.com",
            passwordHash: passwordHashVanshika,
            phone: "+91 9389849873",
            role: "attendee",
            profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            isActive: true
        });

        console.log("Seeded Indian Users & Roles.");

        // 3. Seed Events
        const sampleEventsData = [
            {
                title: "Global Tech Summit & AI Expo 2026",
                description: "Join 5,000+ engineers, founders, and innovators for keynotes, workshops, and startup pitches covering GenAI, Cloud Native, and Quantum Computing.",
                category: "Tech",
                venue: "Pragati Maidan Convention Center, Hall 5",
                location: "New Delhi",
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                startTime: "09:00",
                endTime: "18:00",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "Standard Pass", price: 999, capacity: 300, sold: 12 },
                    { name: "VIP All-Access Pass", price: 2999, capacity: 50, sold: 4 },
                    { name: "Student Pass", price: 499, capacity: 100, sold: 25 }
                ]
            },
            {
                title: "Neon Dreams: Electronic Music Festival",
                description: "An electrifying open-air audio-visual experience featuring top DJs, laser installations, food village, and visual spectacles.",
                category: "Music",
                venue: "Bandra Fort Amphitheatre",
                location: "Mumbai",
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                startTime: "17:00",
                endTime: "23:30",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "General Admission", price: 1499, capacity: 800, sold: 120 },
                    { name: "Front Row VIP", price: 3499, capacity: 150, sold: 45 },
                    { name: "Group Pass (4 Pax)", price: 4999, capacity: 50, sold: 10 }
                ]
            },
            {
                title: "National Football Championship Finals",
                description: "Witness the ultimate championship showdown between top regional clubs. High-energy match, live halftime entertainment, and fan zones.",
                category: "Sports",
                venue: "Jawaharlal Nehru Stadium",
                location: "New Delhi",
                date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                startTime: "16:00",
                endTime: "20:00",
                image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "East Stand", price: 350, capacity: 1200, sold: 340 },
                    { name: "West VIP Pavilion", price: 1200, capacity: 300, sold: 95 }
                ]
            },
            {
                title: "Contemporary Art & Design Biennale",
                description: "An inspiring exhibition celebrating modern sculptures, digital canvas installations, and creative art talks by renowned visual artists.",
                category: "Arts",
                venue: "National Gallery of Modern Art",
                location: "Bengaluru",
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                startTime: "10:00",
                endTime: "19:00",
                image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "Single Day Entry", price: 250, capacity: 500, sold: 40 },
                    { name: "Weekend Pass + Guided Tour", price: 650, capacity: 100, sold: 18 }
                ]
            },
            {
                title: "Hands-on Full-Stack Web Development Workshop",
                description: "Intensive 2-day live workshop covering modern React 19, Node.js backend performance, cloud container deployment, and microservices architecture.",
                category: "Workshops",
                venue: "CoWork Hub, Koramangala",
                location: "Bengaluru",
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                startTime: "10:00",
                endTime: "17:00",
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "Workshop Seat", price: 799, capacity: 40, sold: 22 }
                ]
            },
            {
                title: "Agra Heritage & Culinary Walking Trail",
                description: "Discover hidden architectural gems, Mughal storytelling, and authentic local delicacies with master culinary historians.",
                category: "Travel",
                venue: "Taj East Gate Entrance",
                location: "Agra",
                date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                startTime: "06:30",
                endTime: "10:30",
                image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
                organizer: organizerUser._id,
                status: "published",
                ticketTypes: [
                    { name: "Guided Walk Pass", price: 500, capacity: 25, sold: 15 }
                ]
            }
        ];

        const createdEvents = await Event.create(sampleEventsData);
        console.log(`Seeded ${createdEvents.length} Events.`);

        // 4. Seed Sample Bookings & QR Tickets for Ram, Keshav, and Vanshika
        const techEvent = createdEvents[0];
        const musicEvent = createdEvents[1];

        // Ram's Booking
        const ticketType1 = techEvent.ticketTypes[0];
        const qty1 = 2;
        const total1 = ticketType1.price * qty1;
        const ref1 = "BK-RAM-2026-9042";

        const bookingRam = await Booking.create({
            attendee: attendeeRam._id,
            event: techEvent._id,
            ticketTypeId: ticketType1._id,
            ticketTypeName: ticketType1.name,
            quantity: qty1,
            unitPrice: ticketType1.price,
            totalAmount: total1,
            bookingReference: ref1,
            status: "confirmed"
        });

        for (let i = 0; i < qty1; i++) {
            const ticketCode = `TKT-${ref1}-${i + 1}`;
            const qrDataUrl = await QRCode.toDataURL(ticketCode, {
                width: 300,
                margin: 2,
                color: { dark: "#1e1b4b", light: "#ffffff" }
            });

            await Ticket.create({
                booking: bookingRam._id,
                attendee: attendeeRam._id,
                event: techEvent._id,
                ticketTypeId: ticketType1._id,
                ticketTypeName: ticketType1.name,
                unitPrice: ticketType1.price,
                ticketCode: ticketCode,
                qrCode: qrDataUrl,
                status: i === 0 ? "active" : "used",
                checkedInAt: i === 1 ? new Date() : null,
                checkedInBy: i === 1 ? organizerUser._id : null
            });
        }

        // Keshav's Booking
        const ticketType2 = musicEvent.ticketTypes[0];
        const ref2 = "BK-KESHAV-2026-8190";
        const bookingKeshav = await Booking.create({
            attendee: attendeeKeshav._id,
            event: musicEvent._id,
            ticketTypeId: ticketType2._id,
            ticketTypeName: ticketType2.name,
            quantity: 1,
            unitPrice: ticketType2.price,
            totalAmount: ticketType2.price,
            bookingReference: ref2,
            status: "confirmed"
        });

        const codeKeshav = `TKT-${ref2}-1`;
        const qrKeshav = await QRCode.toDataURL(codeKeshav, {
            width: 300,
            margin: 2,
            color: { dark: "#1e1b4b", light: "#ffffff" }
        });

        await Ticket.create({
            booking: bookingKeshav._id,
            attendee: attendeeKeshav._id,
            event: musicEvent._id,
            ticketTypeId: ticketType2._id,
            ticketTypeName: ticketType2.name,
            unitPrice: ticketType2.price,
            ticketCode: codeKeshav,
            qrCode: qrKeshav,
            status: "active"
        });

        // Vanshika's Booking
        const ref3 = "BK-VANSHIKA-2026-7241";
        const bookingVanshika = await Booking.create({
            attendee: attendeeVanshika._id,
            event: techEvent._id,
            ticketTypeId: techEvent.ticketTypes[1]._id,
            ticketTypeName: techEvent.ticketTypes[1].name,
            quantity: 1,
            unitPrice: techEvent.ticketTypes[1].price,
            totalAmount: techEvent.ticketTypes[1].price,
            bookingReference: ref3,
            status: "confirmed"
        });

        const codeVanshika = `TKT-${ref3}-1`;
        const qrVanshika = await QRCode.toDataURL(codeVanshika, {
            width: 300,
            margin: 2,
            color: { dark: "#1e1b4b", light: "#ffffff" }
        });

        await Ticket.create({
            booking: bookingVanshika._id,
            attendee: attendeeVanshika._id,
            event: techEvent._id,
            ticketTypeId: techEvent.ticketTypes[1]._id,
            ticketTypeName: techEvent.ticketTypes[1].name,
            unitPrice: techEvent.ticketTypes[1].price,
            ticketCode: codeVanshika,
            qrCode: qrVanshika,
            status: "active"
        });

        // 5. Seed Payments
        await Payment.create([
            {
                booking: bookingRam._id,
                user: attendeeRam._id,
                amount: total1,
                currency: "INR",
                paymentMethod: "upi",
                paymentStatus: "completed",
                transactionId: "TXN-UPI-9389849873",
                paymentDetails: { vpa: "ram@okhdfcbank" }
            },
            {
                booking: bookingKeshav._id,
                user: attendeeKeshav._id,
                amount: ticketType2.price,
                currency: "INR",
                paymentMethod: "card",
                paymentStatus: "completed",
                transactionId: "TXN-CARD-819022",
                paymentDetails: { cardBrand: "Visa", cardLast4: "4242" }
            }
        ]);

        // 6. Seed Activity Logs
        await ActivityLog.create([
            {
                user: adminUser._id,
                action: "SYSTEM_INITIALIZED",
                category: "system",
                details: "Database initialized with production configurations and sample seed data."
            },
            {
                user: organizerUser._id,
                action: "EVENT_CREATED",
                category: "event",
                details: `Organizer Mohit Verma created event "${techEvent.title}"`
            },
            {
                user: attendeeRam._id,
                action: "BOOKING_CREATED",
                category: "booking",
                details: `Ram Kumar booked 2 tickets for "${techEvent.title}" (Ref: ${ref1})`
            },
            {
                user: attendeeKeshav._id,
                action: "BOOKING_CREATED",
                category: "booking",
                details: `Keshav Gupta booked 1 ticket for "${musicEvent.title}" (Ref: ${ref2})`
            }
        ]);

        // 7. Seed Settings
        await Setting.create([
            {
                key: "site_name",
                value: "Eventix Global Ticketing",
                description: "Application brand name displayed across the portal."
            },
            {
                key: "platform_fee_percent",
                value: 3.5,
                description: "Convenience fee percentage applied at checkout."
            },
            {
                key: "support_email",
                value: "support@eventix.com",
                description: "Official support contact email."
            },
            {
                key: "support_phone",
                value: "+91 9389849873",
                description: "Official customer helpline."
            },
            {
                key: "currency_symbol",
                value: "₹",
                description: "Default currency symbol."
            }
        ]);

        console.log("✅ Seeding completed successfully!");
        console.log("\n================ DEMO ACCOUNTS ================");
        console.log("👑 Admin:      admin@eventix.com     / admin123 (Rahul Sharma)");
        console.log("🎪 Organizer:  organizer@eventix.com / organizer123 (Mohit Verma)");
        console.log("🎟️ Attendee:   attendee@eventix.com  / attendee123 (Ram Kumar)");
        console.log("🎟️ Attendee 2: keshav@eventix.com    / keshav123 (Keshav Gupta)");
        console.log("🎟️ Attendee 3: vanshika@eventix.com  / vanshika123 (Vanshika Singh)");
        console.log("📞 Contact:    +91 9389849873");
        console.log("================================================\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
