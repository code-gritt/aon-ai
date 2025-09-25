import { Link as LinkScroll } from "react-scroll";
import { useEffect, useState } from "react";
import clsx from "clsx";

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const NavLink = ({ title }) => {
    return (
      <LinkScroll
        onClick={() => setIsOpen(false)}
        to={title}
        offset={-100}
        spy
        smooth
        activeClass="nav-active"
        className="base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5"
      >
        {title}
      </LinkScroll>
    );
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500",
        hasScrolled && "py-2 bg-black-100" + " backdrop-blur-[8px]"
      )}
    >
      <div className="container flex h-14 items-center max-lg:px-5">
        <a className="lg:hidden flex-1 cursor-pointer z-2">
          <svg
            width="160"
            height="55"
            viewBox="0 0 160 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle element for logo icon */}
            <circle cx="27" cy="27" r="20" fill="#0F3460" />
            <circle cx="27" cy="27" r="14" fill="#1A1A2E" />

            {/* Stylized "A" inside circle */}
            <path
              d="M20 34 L27 18 L34 34 H30 L27 27 L24 34 H20 Z"
              fill="#EAEDFF"
            />

            {/* Text "Aon AI" next to logo */}
            <text
              x="60"
              y="34"
              fontFamily="Helvetica, Arial, sans-serif"
              fontWeight="700"
              fontSize="28"
              fill="#EAEDFF"
            >
              Aon AI
            </text>
          </svg>
        </a>

        <div
          className={clsx(
            "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2 max-lg:opacity-0",
            isOpen ? "max-lg:opacity-100" : "max-lg:pointer-events-none"
          )}
        >
          <div className="w-full max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                <li className="nav-li">
                  <NavLink title="features" />
                  <div className="dot" />
                  <NavLink title="pricing" />
                </li>
                <li className="nav-logo">
                  <LinkScroll
                    to="hero"
                    offset={-250}
                    spy
                    smooth
                    className="max-lg:hidden transition-transform duration-500 cursor-pointer"
                  >
                    <svg
                      width="160"
                      height="55"
                      viewBox="0 0 160 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Circle element for logo icon */}
                      <circle cx="27" cy="27" r="20" fill="#0F3460" />
                      <circle cx="27" cy="27" r="14" fill="#1A1A2E" />

                      {/* Stylized "A" inside circle */}
                      <path
                        d="M20 34 L27 18 L34 34 H30 L27 27 L24 34 H20 Z"
                        fill="#EAEDFF"
                      />

                      {/* Text "Aon AI" next to logo */}
                      <text
                        x="60"
                        y="34"
                        fontFamily="Helvetica, Arial, sans-serif"
                        fontWeight="700"
                        fontSize="28"
                        fill="#EAEDFF"
                      >
                        Aon AI
                      </text>
                    </svg>
                  </LinkScroll>
                </li>

                <li className="nav-li">
                  <NavLink title="faq" />
                  <div className="dot" />
                  <NavLink title="download" />
                </li>
              </ul>
            </nav>

            <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0
              mix-blend-soft-light opacity-5"
              />
            </div>
          </div>
        </div>

        <button
          className="lg:hidden z-2 size-10 border-2 border-s4/25 rounded-full flex justify-center items-center"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <img
            src={`/images/${isOpen ? "close" : "magic"}.svg`}
            alt="magic"
            className="size-1/2 object-contain"
          />
        </button>
      </div>
    </header>
  );
};
export default Header;
