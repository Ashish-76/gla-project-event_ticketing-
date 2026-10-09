import React from "react";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

// Pages
import HomePage from "./Pages/Home Page/homePage";
import EventsPage from "./Pages/Event page/eventsPage";
import EventDetailsPage from "./Pages/Event Details Page/eventDetailsPage";
import LoginPage from "./Pages/Login Page/loginPage";
import RegistrationPage from "./Pages/Registration Page/registrationPage";
import MyBookingsPage from "./Pages/My Bookings Page/myBookingsPage";
import ProfilePage from "./Pages/Profile Page/profilePage";

// Organizer Pages
import OrganizerPage from "./Pages/Organizer Page/organizerPage";
import ManageEvents from "./Pages/Organizer Page/manageEvents";
import CreateEvent from "./Pages/Organizer Page/createEvent";
import EditEvent from "./Pages/Organizer Page/editEvent";
import EventAttendees from "./Pages/Organizer Page/eventAttendees";
import QRScannerPage from "./Pages/Organizer Page/qrScannerPage";

// Admin Pages
import AdminDashboard from "./Pages/Admin Page/admin";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/events/:id" element={<EventDetailsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegistrationPage />} />

                            {/* Attendee / Authenticated User Routes */}
                            <Route
                                path="/my-bookings"
                                element={
                                    <ProtectedRoute allowedRoles={["attendee", "organizer", "admin"]}>
                                        <MyBookingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute allowedRoles={["attendee", "organizer", "admin"]}>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Organizer Routes */}
                            <Route
                                path="/organizer"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <OrganizerPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/organizer/events"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <ManageEvents />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/organizer/events/create"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <CreateEvent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/organizer/events/edit/:id"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <EditEvent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/organizer/events/attendees/:id"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <EventAttendees />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/organizer/scanner"
                                element={
                                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                                        <QRScannerPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch-all Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;