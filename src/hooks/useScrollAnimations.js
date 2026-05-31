import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  useEffect(() => {
    // Small delay to ensure DOM is painted
    const ctx = gsap.context(() => {
      // Reveal-up elements
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => el.classList.add('is-visible'),
          once: true,
        });
      });

      // Reveal-left elements
      gsap.utils.toArray('.reveal-left').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => el.classList.add('is-visible'),
          once: true,
        });
      });

      // Reveal-right elements
      gsap.utils.toArray('.reveal-right').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => el.classList.add('is-visible'),
          once: true,
        });
      });

      // Reveal-scale elements
      gsap.utils.toArray('.reveal-scale').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => el.classList.add('is-visible'),
          once: true,
        });
      });

    });

    return () => ctx.revert();
  }, []);
}
