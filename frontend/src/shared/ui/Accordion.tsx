import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => (
        <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            {item.title}
            <motion.span animate={{ rotate: openId === item.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FaChevronDown className="w-3 h-3 text-neutral-500" />
            </motion.span>
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-neutral-400">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
