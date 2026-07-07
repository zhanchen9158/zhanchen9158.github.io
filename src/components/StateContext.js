import React, { createContext, useRef, useState, useCallback, useMemo, useContext } from 'react';
import { useMotionValue } from "motion/react";
import AWSIcon from '../icons/aws.svg';
import MicrosoftIcon from '../icons/microsoft.svg';
import FreecodecampIcon from '../icons/freecodecamp.svg';
import getActiveSection from '../functions/getActivesection';


const CERT_DATA = [
  {
    id: 'cert0',
    icon: AWSIcon,
    title: 'Amazon Web Services Certified Solutions Architect - Associate',
    descriptions: [
      'Identify and design ideal cloud solutions that incorporate AWS services to meet current and future business requirements.',
      'Design architectures with secure accesses and appropriate data security controls.',
      'Design architectures that are scalable, highly-available, and fault-tolerant.',
      'Design architectures with appropriate services and configurations that meet performance demands.',
      'Design cost-optimized architectures.',
    ],
  },
  {
    id: 'cert1',
    icon: MicrosoftIcon,
    title: 'Foundational C# with Microsoft',
    descriptions: [
      'Thorough foundational knowledge of the core concepts, syntax, data structures, and algorithms of C#.',
      'Identify and structure code solutions based on reusable and maintainability principles.',
      'Create applications that adhere to exception handling principles.',
      'Troubleshoot applications through the use of debugging processes and Visual Studio Code debugger.',
    ],
  },
  {
    id: 'cert2',
    icon: FreecodecampIcon,
    title: 'JavaScript Algorithms and Data Structures',
    descriptions: [
      'Fundamental and advanced knowledge focused on ES6+, Object-Oriented Programming (OOP), and Functional Programming paradigms.',
      'Develope algorithmic solutions for data manipulation, including regular expression, recursion, and complex state logic.',
      'Produce optimized solutions utilizing algorithmic efficiency, memoization and dynamic programming, and mathematical optimization.',
    ],
  },
  {
    id: 'cert3',
    icon: FreecodecampIcon,
    title: 'Responsive Web Design Developer',
    descriptions: [
      'Thorough foundational knowledge in HTML, CSS, and responsive web design.',
      'Implemente modern layout techniques including mobile-first responsive strategy, fluid grids, and responsive UI to create complex, fluid user interfaces.',
      'Apply Web Content Accessibility Guidelines (WCAG) standards, utilizing semantic HTML to ensure screen-reader compatibility and SEO optimization.',
    ],
  },
];

const StateContext = createContext();

export function StateProvider({ children }) {
  const [activeSkillsId, setActiveSkillsId] = useState(null);
  const [activesection, setActivesection] = useState({});

  const sectionRef = useRef({});

  const section = useMemo(() => getActiveSection(activesection), [activesection]);

  const handleViewport = useCallback((section, inview) => {
    setActivesection(prev => ({ ...prev, [section]: inview }));
  }, []);

  const handleScroll = useCallback((e) => {
    if (section !== 'certifications') return;
    if (e.deltaY < 0 && sectionRef.current?.['highlights']) {
      sectionRef.current['highlights'].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [section]);

  const touchStartY = useRef(0);
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = useCallback((e) => {
    if (section !== 'certifications') return;
    touchStartY.current = e.touches[0].clientY;
  }, [section]);

  const handleTouchEnd = useCallback((e) => {
    if (section !== 'certifications') return;
    if (!touchStartY.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    if (deltaY > SWIPE_THRESHOLD) {
      sectionRef.current['highlights'].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }

    if (-deltaY > SWIPE_THRESHOLD) {
      sectionRef.current['introduction'].scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
    }

    touchStartY.current = 0;
  }, [section]);


  const [cert, setCert] = useState(null);
  const certCoordRef = useRef({ x: 0, y: 0 });
  const handleCertSelect = useCallback((v = 'cert0') => {
    if (v === null) {
      setCert(null);
      return;
    }

    const match = v?.match(/\d+$/);
    setCert((prev) => {
      if (match === null) return null;
      const index = parseInt(match[0], 10);
      if (index >= CERT_DATA.length) return null;
      if (prev?.id === v) return null;

      return CERT_DATA[index];
    });
  }, []);


  const [highlightImage, setHighlightImage] = useState(null);
  const handleActivatingHighlightImage = useCallback((v) => {
    setHighlightImage(v);
  }, []);
  const highlightHovered = useRef(null);

  const contextValue = useMemo(() => ({
    activeSkillsId, setActiveSkillsId,
    activesection, handleViewport,
    sectionRef, handleScroll,
    handleTouchStart, handleTouchEnd,
    highlightImage, handleActivatingHighlightImage,
    highlightHovered,
    cert, handleCertSelect,
    certCoordRef, CERT_DATA,
  }), [
    activeSkillsId, setActiveSkillsId,
    activesection, handleViewport,
    sectionRef, handleScroll,
    handleTouchStart, handleTouchEnd,
    highlightImage, handleActivatingHighlightImage,
    highlightHovered,
    cert, handleCertSelect,
    certCoordRef, CERT_DATA
  ]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);