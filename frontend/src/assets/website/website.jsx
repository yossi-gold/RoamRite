import DomeGallery from './DomeGallery';
import styles from './website.module.css';
import { useEffect } from 'react';
import { DollarSign, Users, MessageCircle, Map, Calendar, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';



export const Website = () => {


    useEffect(() => {
        document.title = 'RoamRite - Your Ultimate Travel Companion';
        document.body.style.backgroundColor = 'black';
    })




    //const [scrolled, setScrolled] = useState(false);

    /* useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []); */

    const features = [
        {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Expense Breakdown",
            description: "Track every dollar with detailed categorization. Real-time budget monitoring with color-coded alerts keeps you informed and in control of your spending.",
            screenshot: "./expenseBreakdown.png"
        },
        {
            icon: <Map className="w-8 h-8" />,
            title: "Activity Suggestions",
            description: "AI-powered recommendations tailored to your budget. Discover experiences that fit your financial plan and maximize your adventure without overspending.",
            screenshot: "./activitySuggestions.png"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Multi-Trip Management",
            description: "Organize unlimited trips in one place. Switch between past, current, and future adventures seamlessly with comprehensive trip history.",
            screenshot: "./multiTripManagement3.png"
        }
    ];

    const testimonials = [
        {
            quote: "RoamRite saved us over $1,500 on our European trip. The expense tracking is incredibly intuitive.",
            author: "Sarah Chen",
            role: "Frequent Traveler"
        },
        {
            quote: "Best travel budget app I've used. The activity suggestions based on our budget were spot-on.",
            author: "Michael Rodriguez",
            role: "Digital Nomad"
        },
        {
            quote: "Managing our group trip budget has never been easier. Everyone stays on the same page.",
            author: "Jessica Thompson",
            role: "Travel Coordinator"
        }
    ];






    return (<div style={{ backgroundColor: 'black' }}>

<div className={styles.headerContainer} id='top'>
    <header className={styles.header}>
            <div className={styles.rightSection}>
                <a href='#top'>Welcome</a>
                <a href='#features'>Features</a>
                {/* <Link>Contact</Link> */}
                <Link>About us</Link>
                <Link to={'/login'}>Login/Signup</Link>
            </div>

        </header>

        <div className={styles.DomeGalleryContainer} >
            <DomeGallery className={styles.domeGallery} >

            </DomeGallery>
            <img className={styles.logo} src="./preview.webp" alt="logo" />
            {/*    <img className={styles.logo} src="./logo.jpg" alt="logo" /> */}

        </div>

</div>
        
        
        


        <div className={`relative min-h-screen bg-black`} >
            {/* Hero Section */}
            <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${styles.main}`} style={{ borderTopLeftRadius: '70px', borderTopRightRadius: '70px' }}>
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0" >
                    {/* Base gradient background */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

                    {/* Subtle pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-15 z-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "60px 60px",
                        }}
                    ></div>

                    {/* Black transparent gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 z-10"></div>
                </div>

                {/* Content */}
                <div className="relative z-20 max-w-6xl mx-auto px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Budget Travel,<br />Mastered.
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                        The intelligent trip budgeting app that helps you spend smart, track expenses, and discover more while traveling within your means.
                    </p>

                    {/* Primary CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">

                        <a href="./signup" className="group bg-sky-500 hover:bg-sky-600 text-white px-10 py-5 rounded-lg text-lg font-semibold transition-all inline-flex items-center space-x-3 shadow-2xl">
                            {/* <Smartphone className="w-6 h-6" /> */}
                            <span>Join Now</span>
                        </a>
                    </div>

                    {/* Trust Indicators */}

                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <ChevronRight className="w-8 h-8 text-white transform rotate-90" />
                </div>
            </section>

            {/* Core Features Section */}
            <section id="features" className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                            Powerful Features for Smart Travel
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your travel budget with confidence
                        </p>
                    </div>

                    <div className="space-y-32">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="bg-sky-500 p-4 rounded-xl text-white">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-bold text-black">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                    <div className="relative">
                                        {/* Phone Mockup Frame */}
                                        <div className="relative mx-auto" style={{ maxWidth: '360px' }}>
                                            <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                                                <div
                                                    className="rounded-[2.5rem] overflow-hidden shadow-lg"
                                                    style={{
                                                        height: "30vh",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "linear-gradient(135deg, #f9fafb, #e0f2fe)",
                                                    }}
                                                >
                                                    <img
                                                        src={feature.screenshot}
                                                        alt={`${feature.title} screenshot`}

                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                {/* Phone notch */}
                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social & Collaborative Section */}
            <section className="py-24 px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                            Travel Better Together
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Keep your entire group in sync with collaborative budgeting and real-time communication
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
                            <div className="bg-sky-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">Invite Travelers</h3>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Add friends and family to your trip with a simple invite link. Everyone can view the budget, add expenses, and stay informed about group spending in real-time.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Instant invite links</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Shared expense tracking</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Group budget visibility</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
                            <div className="bg-sky-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">Live Messaging</h3>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Communicate directly within the app. Discuss expenses, share ideas, and coordinate activities without switching between multiple apps or platforms.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Real-time chat</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Expense discussions</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <span>Activity planning</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proof & Trust Section */}
            <section className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center pb-26 pt-26" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(./travel4.png)", backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(42px)' }}>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Trusted by Travelers Worldwide
                        </h2>
                        <p className="text-xl text-gray-200">
                            Join thousands who are budgeting smarter and traveling better
                        </p>
                    </div>

                    {/* Testimonials */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed italic">
                                    &quot;{testimonial.quote}&quot;
                                </p>
                                <div>
                                    <div className="font-semibold text-black">{testimonial.author}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                   

                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-sky-500 to-sky-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Start Your Smarter Travel Journey Today
                    </h2>
                    <p className="text-xl text-sky-50 mb-10 leading-relaxed">
                        Take control of your travel budget. Totally free
                    </p>

                    {/* Secondary CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="./signup" className="group bg-white hover:bg-gray-100 text-sky-600 px-12 py-5 rounded-lg text-lg font-bold transition-all inline-flex items-center space-x-3 shadow-xl">
                            <span>Get Started</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>


                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                        © 2025 RoamRite. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
     


    </div>
    );
}











