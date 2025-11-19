"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeInUp, motionTransition, viewportOnce } from "@/lib/motion/variants";
import { motion } from "framer-motion";
import { useState } from "react";

export function SectionContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      message: !formData.message.trim(),
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      // エラーがある場合は送信処理を行わない（必要に応じてトーストなどを追加）
      return;
    }

    // TODO: フォーム送信処理を実装
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-10" id="contact">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter text-white"
            variants={fadeInUp}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="max-w-2xl text-sm md:text-base text-white/70"
            variants={fadeInUp}
          >
            Have a project in mind? We&apos;d love to hear from you. Send us a message and
            we&apos;ll respond as soon as possible.
          </motion.p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ ...motionTransition.default, delay: 0.2 }}
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium tracking-[0.16em] text-white/60 uppercase"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ate9-red ${
                  errors.name
                    ? "border-ate9-red/80 shadow-[0_0_0_1px_rgba(242,66,109,0.45)]"
                    : "border-ate9-gray/60"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium tracking-[0.16em] text-white/60 uppercase"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ate9-red ${
                  errors.email
                    ? "border-ate9-red/80 shadow-[0_0_0_1px_rgba(242,66,109,0.45)]"
                    : "border-ate9-gray/60"
                }`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-xs font-medium tracking-[0.16em] text-white/60 uppercase"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className={`bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ate9-red ${
                errors.message
                  ? "border-ate9-red/80 shadow-[0_0_0_1px_rgba(242,66,109,0.45)]"
                  : "border-ate9-gray/60"
              }`}
            />
          </div>
          <div className="flex justify-center">
            <Button
              size="lg"
              type="submit"
              className="w-full sm:w-auto bg-ate9-red text-white hover:bg-ate9-red-dark hover:opacity-100 active:opacity-100 focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="truncate">Send Message</span>
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

