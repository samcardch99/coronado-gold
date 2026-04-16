import React, { useRef, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function Footer({ className }) {
  const formRef = useRef(null);
  const textareaRef = useRef(null); // Ref para el acceso directo al DOM del textarea

  const formSchema = useMemo(
    () =>
      z.object({
        username: z.string().min(2, "Please enter a valid name"),
        email: z.string().email("Please enter a valid email"),
        phone: z.string().min(5, "Please enter a valid phone number"),
        message: z.string().min(10, "The message must be at least 10 characters long"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    watch, // Necesitamos observar el cambio de valor
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onSubmit",
  });

  // Observamos el campo 'message'
  const messageValue = watch("message");

  // EFECTO DE RESIZE
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resize = () => {
      textarea.style.height = "auto"; // Reset para recalcular

      const lineHeight = 24;
      const maxRows = 3;
      const maxHeight = lineHeight * maxRows;

      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Control de scroll
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    resize();
  }, [messageValue]); // Se ejecuta cada vez que el texto cambia

  const onSubmit = async (data) => {
    if (!formRef.current) return;
    try {
      await emailjs.sendForm(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
      );

      toast.success("Success", { description: "Your message has been sent successfully" });
      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Error", { description: "Something went wrong, please try again later" });
    }
  };

  // Combinamos la ref de react-hook-form con nuestra ref local
  const { ref: registerRef, ...registerProps } = register("message");

  return (
    <div className="w-full mt-7 mb-7 lg:mt-0 lg:mb-0 z-50 md-custom:w-4/5 md:w-4/5 lg:w-200">
      <h2 className={`text-2xl md:text-6xl lg:text-4xl ${className} w-4/5 md:w-3/5 mb-5 md:mb-14 lg:mb-10 whitespace-nowrap`}>
        Contact Us
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 md:space-y-10 lg:space-y-6 flex flex-col items-start w-full text-sm md:text-4xl lg:text-2xl ${className}`}
      >
        {/* ... Inputs de Name, Email y Phone se mantienen igual ... */}
        <div className="w-full">
          <input {...register("username")} placeholder="NAME" className="w-full bg-transparent border-b border-darkRed/80 placeholder:text-darkRed/80 pb-1 outline-none text-darkRed" />
          {errors.username && <p className="text-xs text-red-900 mt-1 font-sans">{errors.username.message}</p>}
        </div>

        <div className="w-full">
          <input {...register("email")} type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-darkRed/80 placeholder:text-darkRed/80 pb-1 outline-none text-darkRed" />
          {errors.email && <p className="text-xs text-red-900 mt-1 font-sans">{errors.email.message}</p>}
        </div>

        <div className="w-full">
          <input {...register("phone")} type="tel" placeholder="PHONE NUMBER" className="w-full bg-transparent border-b border-darkRed/80 placeholder:text-darkRed/80 pb-1 outline-none text-darkRed" />
          {errors.phone && <p className="text-xs text-red-900 mt-1 font-sans">{errors.phone.message}</p>}
        </div>

        {/* COMMENTS CON AUTO-RESIZE */}
        <div className="w-full">
          <textarea
            {...registerProps}
            ref={(e) => {
              registerRef(e); // Asigna la ref a react-hook-form
              textareaRef.current = e; // Asigna la ref a nuestro efecto local
            }}
            placeholder="COMMENTS"
            rows={1}
            className="w-full bg-transparent border-b border-darkRed/80 placeholder:text-darkRed/80 pb-1 outline-none text-darkRed resize-none leading-6"
            style={{ minHeight: "24px" }} // Evita saltos en la hidratación inicial
          />
          {errors.message && (
            <p className="text-xs text-red-900 mt-1 font-sans">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer text-white text-lg md:text-4xl lg:text-3xl font-medium rounded-full px-6 py-3 md:px-10 md:py-4 transition-all duration-200 active:scale-95 disabled:opacity-50"
          style={{
            background: "linear-gradient(145deg, #7a1a0a 0%, #68150A 50%, #520f08 100%)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: [
              "0 8px 10px rgba(0,0,0,0.30)",
              "inset 2px 2px 6px rgba(255,255,255,0.18)",
              "inset -2px -2px 6px rgba(0,0,0,0.25)",
            ].join(", "),
          }}
        >
          {isSubmitting ? "SENDING..." : "SEND"}
        </button>
      </form>
    </div>
  );
}