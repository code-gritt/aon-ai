import { Element } from "react-scroll";
import { links, logos } from "../constants/index.jsx";
import { Marker } from "../components/Marker.jsx";

const Download = () => {
  return (
    <section>
      <Element
        name="download"
        className="g7 relative pb-32 pt-24 max-lg:pb-24 max-md:py-16"
      >
        <div className="container">
          <div className="flex items-center">
            <div className="relative mr-6 flex-540 max-xl:flex-280 max-lg:flex256 max-md:flex-100">
              <div className="mb-10">
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
              </div>

              <p className="body-1 mb-10 max-w-md">
                Experience Aon AI on Web, PC, or mobile—edit, enhance, and
                transform your images effortlessly with AI-powered tools.
              </p>
            </div>

            <div className="mb-10 max-md:hidden">
              <div className="download_preview-before download_preview-after rounded-40 relative w-[955px] border-2 border-s5 p-6">
                <div className="relative rounded-3xl bg-s1 px-6 pb-6 pt-14">
                  <span className="download_preview-dot left-6 bg-p2" />
                  <span className="download_preview-dot left-11 bg-s3" />
                  <span className="download_preview-dot left-16 bg-p1/15" />

                  <img
                    src="/images/screen.jpg"
                    width={855}
                    height={655}
                    alt="Aon AI Screenshot"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-24 flex justify-center max-lg:hidden">
            {logos.map(({ id, url, width, height, title }) => (
              <li key={id} className="mx-10">
                <img src={url} width={width} height={height} alt={title} />
              </li>
            ))}
          </ul>
        </div>
      </Element>
    </section>
  );
};
export default Download;
