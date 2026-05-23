import React, { useState, useEffect } from "react";
import contactBg from "../assets/images/about/3.jpg";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  MessageSquare,
  Users,
  HeadphonesIcon,
  Sparkles,
} from "lucide-react";

function Reveal({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = "Contact Us - Aayubakwath";

    const description =
      "Get in touch with Aayubakwath for inquiries, partnerships, or support. Our team is here to help.";
    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "919443157282";
    const message = `Hello, I would like to contact you.

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Message: ${form.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: "No:1/770, K.Ayyampalayam (PO)",
      sub: "Palladam, Tiruppur, TN 641662",
      href: null,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "support@aayubakwath.com",
      sub: "Reply within 24 hours",
      href: "mailto:support@aayubakwath.com",
    },
    // {
    //   icon: Phone,
    //   label: "Call Us",
    //   value: "+91 94431 57282",
    //   sub: "Mon – Sat, 9 AM – 6 PM",
    //   href: "tel:+919443157282",
    // },
  ];

  const whyContactUs = [
    "Product & Service Inquiries",
    "Business Partnerships",
    "Distribution Queries",
    "General Questions",
  ];

  return (
    <>
      <div className="relative bg-white min-h-screen overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gray-200/10 to-transparent pointer-events-none z-0" />
        <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gray-100 blur-[120px] pointer-events-none z-0" />
        <div className="fixed top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-gray-100 blur-[120px] pointer-events-none z-0" />

        {/* ── Hero Section ── */}
        <div className="relative z-10 w-full mb-6 pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1550px] mx-auto">
            <div className="relative w-full overflow-hidden rounded-2xl clean-card min-h-[400px] lg:min-h-[520px] flex items-center shadow-sm border border-gray-100 bg-white group hover:shadow-xl transition-shadow duration-500">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={contactBg}
                  alt="Contact Banner"
                  className="w-full h-full object-cover object-center opacity-85 scale-105 transition-transform duration-1000 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent w-full md:w-3/4 lg:w-2/3" />
              </div>

              <div className="relative z-10 px-8 sm:px-16 md:px-24 max-w-3xl py-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-8 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111827] relative">
                    <span className="absolute inset-0 rounded-full bg-[#111827] animate-ping opacity-50"></span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Get In Touch
                  </span>
                </div>

                <h1 className="text-[36px] sm:text-[48px] md:text-[56px] font-black tracking-tighter text-[#111827] mb-6 leading-[1.05]">
                  Let's Start a
                  <br />
                  <span className="text-[#111827] relative inline-block">
                    Conversation.
                    <div className="absolute bottom-2 left-0 w-full h-4 bg-gray-100 -z-10 -rotate-2"></div>
                  </span>
                </h1>

                <p className="text-gray-500 font-medium text-lg lg:text-xl leading-relaxed mb-6 max-w-xl">
                  Have questions, partnerships, or inquiries? Our dedicated team
                  is here and happy to help you every step of the way.
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-[#111827]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-xl text-[#111827]">
                        24h
                      </p>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        Response Time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-[#111827]">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-xl text-[#111827]">
                        6×
                      </p>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        Days / Week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-[#111827]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-xl text-[#111827]">
                        100%
                      </p>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        Dedicated
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#contact-form"
                    className="bg-black text-white rounded-r-xl rounded-l-none px-10 py-4 text-[15px] shadow-lg shadow-gray-200 hover:-translate-y-1 hover:bg-black hover:text-white transition-transform inline-flex items-center gap-2"
                  >
                    Send Message <ArrowRight size={16} />
                  </a>
                  <a
                    href="tel:+919443157282"
                    className="btn-outline rounded-xl px-10 py-4 text-[15px] bg-white/50 backdrop-blur-md hover:-translate-y-1 transition-transform border-gray-200 text-[#111827] hover:border-[#111827] inline-flex items-center gap-2"
                  >
                    <Phone size={16} /> Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Contact Cards */}
          <Reveal>
            <div className="mb-12">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  01 — Contact Info
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-black tracking-tight text-[#111827]">
                  Reach Us Directly
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {contactCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="clean-card rounded-2xl p-8 border border-gray-100 shadow-sm h-full group hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#111827] to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-gray-100 text-[#111827] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon size={24} />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                          {card.label}
                        </p>
                        {card.href ? (
                          <a
                            href={card.href}
                            className="font-display font-semibold text-lg text-[#111827] hover:text-[#111827] transition-colors block mb-1 break-all"
                          >
                            {card.value}
                          </a>
                        ) : (
                          <p className="font-display font-semibold text-lg text-[#111827] mb-1">
                            {card.value}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm font-medium">
                          {card.sub}
                        </p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Form + Panel Section */}
          <div
            id="contact-form"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12"
          >
            {/* Left Panel */}
            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <div className="clean-card rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#111827] via-gray-300 to-[#111827]" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#111827]">
                        Dedicated Support
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#111827] mb-3">
                      Every message gets a personal reply.
                    </h3>
                    <p className="text-gray-600 font-medium text-sm leading-relaxed mb-8">
                      We value every conversation — our team reads and responds
                      to everything personally.
                    </p>

                    <div className="space-y-4 mb-8">
                      {whyContactUs.map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#111827] flex-shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm font-semibold text-[#111827]">
                            {t}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin
                          size={16}
                          className="text-gray-500 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-600 font-medium">
                          Palladam, Tamil Nadu
                        </p>
                      </div>
                      <div className="flex items-start gap-3 mb-3">
                        <Clock
                          size={16}
                          className="text-gray-500 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-600 font-medium">
                          Mon – Sat · 9 AM – 6 PM IST
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail
                          size={16}
                          className="text-gray-500 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-600 font-medium">
                          Response within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-3">
              <Reveal delay={0.15}>
                <div className="clean-card rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full">
                  <div className="h-1.5 bg-gradient-to-r from-[#111827] via-gray-300 to-[#111827]" />
                  <div className="p-8 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-gray-500">
                      02 — Send a Message
                    </p>
                    <h3 className="font-display font-semibold text-2xl text-[#111827] mb-8">
                      We'd Love to Hear From You
                    </h3>

                    {submitted && (
                      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-6">
                        <CheckCircle2
                          size={20}
                          className="text-emerald-500 flex-shrink-0"
                        />
                        <p className="text-sm font-semibold text-emerald-700">
                          Message sent! We'll be in touch within 24 hours.
                        </p>
                      </div>
                    )}

                    <form onSubmit={onSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-[12px] font-semibold uppercase tracking-widest mb-2 text-[#111827]/70"
                          >
                            Full Name *
                          </label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#111827] transition-colors pointer-events-none">
                              <Users size={18} />
                            </span>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={form.name}
                              onChange={onChange}
                              required
                              placeholder="Your name"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.08)]"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-[12px] font-semibold uppercase tracking-widest mb-2 text-[#111827]/70"
                          >
                            Phone
                          </label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#111827] transition-colors pointer-events-none">
                              <Phone size={18} />
                            </span>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={onChange}
                              placeholder="+91 98765 43210"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.08)]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-5">
                        <label
                          htmlFor="email"
                          className="block text-[12px] font-semibold uppercase tracking-widest mb-2 text-[#111827]/70"
                        >
                          Email Address *
                        </label>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#111827] transition-colors pointer-events-none">
                            <Mail size={18} />
                          </span>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.08)]"
                          />
                        </div>
                      </div>

                      <div className="mb-8">
                        <label
                          htmlFor="message"
                          className="block text-[12px] font-semibold uppercase tracking-widest mb-2 text-[#111827]/70"
                        >
                          Message *
                        </label>
                        <div className="relative group">
                          <span className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#111827] transition-colors pointer-events-none">
                            <MessageSquare size={18} />
                          </span>
                          <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            required
                            rows={5}
                            placeholder="Tell us how we can help…"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.08)] resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#111827] text-white rounded-xl w-full py-4 text-[14px] shadow-xl shadow-gray-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-300 transition-all duration-300 inline-flex items-center justify-center gap-2"
                      >
                        Send Message <Send size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Map Section */}
          <Reveal>
            <div className="mb-12">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  03 — Location
                </p>

                <h2 className="font-display text-3xl lg:text-4xl font-black tracking-tight text-[#111827]">
                  Find Us on the Map
                </h2>
              </div>
              <div className="clean-card rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-100 gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[#111827]">
                      Sri Bakawathi Life Science
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      No:1/770, K.Ayyampalayam(PO), Palladam, TN 641662
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                      Live Map
                    </span>
                  </div>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d250564.89793483046!2d77.3439278!3d11.1076742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3ba9ababa3eecfcf%3A0xd5408d394061bcb5!2sSri%20Bakawathi%20Life%20Science%2C%20No%3A1%2F770%2C%20K.Ayyampalayam(PO)%2C%20K.S.N%20Puram(Via)%2C%20Palladam%2C%20Tamil%20Nadu%20641662!3m2!1d10.982724!2d77.2239895!5e0!3m2!1sen!2sin!4v1772442468303!5m2!1sen!2sin"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Sri Bakawathi Life Science Location"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
