

import styles from './about.module.css';




export const About = () => {

    return (<>




        <div className={` ${styles.main}`}>
            <div className={` ${styles.logo}`}>
                 <img src="travel2.png" alt="logo" />
             {/*    <h2 className="text-[#181811] tracking-light text-[32px] font-bold leading-tight min-w-72" style={{ textAlign: 'center' }}>App Info &amp; Contact</h2>*/}   
              </div>

            <div className={styles.AboutRoamRiteContainer}>
                <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5" style={{ textAlign: 'center' }} >About RoamRite</h2>

                <div className={styles.AboutRoamRiteInfoAndImg}>
                    <div className={styles.AboutRoamRiteInfo}>

                        <p className="text-[#181811] text-base font-normal leading-normal pb-3 pt-1 px-4">
                        
                            At RoamRite, we believe that travel should be as exciting to plan as it is to experience. Too often, the stress of organizing flights, accommodations, budgets, and activities takes away from the joy of the journey itself. That’s where RoamRite comes in — a comprehensive trip management platform that puts simplicity, clarity, and inspiration back into your travel planning. <br /> With RoamRite, you can create smart itineraries, track expenses with ease, and discover new destinations that match your budget and interests. Whether you’re traveling solo, with family, or as part of a group, RoamRite makes it easy to stay organized, share plans, and make adjustments on the go. But RoamRite is more than just a set of tools. It’s about unlocking the freedom to explore without limits. Our mission is to make travel more accessible and enjoyable for everyone, no matter the distance, destination, or budget. So pack your bags — with RoamRite, your next adventure is already within reach.
                        </p>
                    </div>
                    <div className={styles.AboutRoamRiteImg}>

                        <img src="travel3.png" alt="logo" />
                    </div>
                </div>

            </div>



            <div className={styles.contactUs}>
                <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contact Us</h2>
                <p className="text-[#181811] text-base font-normal leading-normal pb-3 pt-1 px-4">
                    We&apos;re here to help! <br />If you have any questions, feedback, or need assistance, <br />please reach out to us through the following channels:
                </p>
            </div>













            <div className={` px-4 py-4 ${styles.eachContactContainer}`}>
                <div className={styles.eachContact}>
                    <div className={`flex items-center justify-center shrink-0 size-16 ${styles.icon}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                        <p className="text-[#181811] text-lg font-bold leading-normal line-clamp-1">Email</p>
                        <p className="text-[#8c8b5f] text-base font-normal leading-normal">info@softgear.dev</p>
                    </div>
                    <a
                        href="#"
                        className="text-[#181811] text-sm font-bold leading-normal tracking-[0.015em] border-b border-dashed border-current"
                    >
                        Send Email
                    </a>
                </div>


                <div className={styles.eachContact}>
                    <div className={`flex items-center justify-center shrink-0 size-16 ${styles.icon}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" ></path>
                        </svg>




                    </div>
                    <div className="flex flex-col justify-center text-center">
                        <p className="text-[#181811] text-lg font-bold leading-normal line-clamp-1">LinkedIn</p>
                        <p className="text-[#8c8b5f] text-base font-normal leading-normal">Yossi Goldberger</p>
                    </div>
                    <a
                        href="#"
                        className="text-[#181811] text-sm font-bold leading-normal tracking-[0.015em] border-b border-dashed border-current"
                    >
                        Visit Now
                    </a>
                </div>


                {/* hidden part/ not used code */}
                <div style={{ display: 'none' }} className="flex flex-col items-center gap-4 p-6 border border-[#f5f5f0] rounded-xl shadow-sm">
                    <div className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-16">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                        <p className="text-[#181811] text-lg font-bold leading-normal line-clamp-1">Phone</p>
                        <p className="text-[#8c8b5f] text-base font-normal leading-normal">+1 (555) 123-4567</p>
                    </div>
                    <a
                        href="#"
                        className="text-[#181811] text-sm font-bold leading-normal tracking-[0.015em] border-b border-dashed border-current"
                    >
                        Call Now
                    </a>
                </div>




            </div>












            {/* hidden part/ not used code */}
            <div style={{ display: 'none' }}>




                <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Connect With Us</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 py-4">
                    <a
                        href="#"
                        className="flex flex-col items-center gap-3 p-6 border border-[#f5f5f0] rounded-xl shadow-sm text-center hover:bg-[#f9f9f7]"
                    >
                        <div className="rounded-lg p-3 bg-[#f5f5f0]">
                            <div className="text-[#181811]" data-icon="LinkedinLogo" data-size="24px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-[#181811] text-base font-medium leading-normal">LinkedIn</p>
                    </a>
                    <a
                        href="#"
                        className="flex flex-col items-center gap-3 p-6 border border-[#f5f5f0] rounded-xl shadow-sm text-center hover:bg-[#f9f9f7]"
                    >
                        <div className="rounded-lg p-3 bg-[#f5f5f0]">
                            <div className="text-[#181811]" data-icon="FacebookLogo" data-size="24px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-[#181811] text-base font-medium leading-normal">Facebook</p>
                    </a>
                    <a
                        href="#"
                        className="flex flex-col items-center gap-3 p-6 border border-[#f5f5f0] rounded-xl shadow-sm text-center hover:bg-[#f9f9f7]"
                    >
                        <div className="rounded-lg p-3 bg-[#f5f5f0]">
                            <div className="text-[#181811]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-[#181811] text-base font-medium leading-normal">Twitter</p>
                    </a>
                    <a
                        href="#"
                        className="flex flex-col items-center gap-3 p-6 border border-[#f5f5f0] rounded-xl shadow-sm text-center hover:bg-[#f9f9f7]"
                    >
                        <div className="rounded-lg p-3 bg-[#f5f5f0]">
                            <div className="text-[#181811]" data-icon="InstagramLogo" data-size="24px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-[#181811] text-base font-medium leading-normal">Instagram</p>
                    </a>
                </div>


                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                    <div className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-12" data-icon="Envelope" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"
                            ></path>
                        </svg>
                    </div>



                    <div className="flex flex-col justify-center">
                        <p className="text-[#181811] text-base font-medium leading-normal line-clamp-1">Email</p>
                        <p className="text-[#8c8b5f] text-sm font-normal leading-normal line-clamp-2">support@journey.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                    <div className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-12" data-icon="Phone" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[#181811] text-base font-medium leading-normal line-clamp-1">Phone</p>
                        <p className="text-[#8c8b5f] text-sm font-normal leading-normal line-clamp-2">+1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-12" data-icon="Globe" data-size="24px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,215.89,116,202.87,107,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154.37,88H101.63C107,69.66,116,53.13,128,40.11,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z"
                                ></path>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-[#181811] text-base font-medium leading-normal line-clamp-1">Social Media</p>
                            <p className="text-[#8c8b5f] text-sm font-normal leading-normal line-clamp-2">Follow us for updates and travel inspiration</p>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <div className="text-[#181811] flex size-7 items-center justify-center" data-icon="ArrowRight" data-size="24px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


   <h2 className={`text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${styles.feedbackFormH2}`}>Feedback Form</h2>
                   
            <div className={styles.feedbackFormContainer}>
                <div className={styles.feedbackForm}>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#181811] text-base font-medium leading-normal pb-2">Subject</p>
                            <input
                                placeholder="Enter subject"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#181811] focus:outline-0 focus:ring-0 border border-[#e6e6db] bg-white focus:border-[#e6e6db] h-14 placeholder:text-[#8c8b5f] p-[15px] text-base font-normal leading-normal"
                                value=""
                            />
                        </label>
                    </div>



                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#181811] text-base font-medium leading-normal pb-2">Message</p>
                            <textarea
                                placeholder="Enter your feedback"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#181811] focus:outline-0 focus:ring-0 border border-[#e6e6db] bg-white focus:border-[#e6e6db] min-h-36 placeholder:text-[#8c8b5f] p-[15px] text-base font-normal leading-normal"
                            ></textarea>
                        </label>
                    </div>


                    <div className="flex px-4 py-3 justify-start">
                        <button
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f9f506] text-[#181811] text-sm font-bold leading-normal tracking-[0.015em]"
                        >
                            <span className="truncate">Submit Feedback</span>
                        </button>
                    </div>
                </div>

                <div className={styles.feedbackFormSvg}>
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f5f5f0" /* fill="#d0eafc" */><path d="m397-115-99-184-184-99 71-70 145 25 102-102-317-135 84-86 385 68 124-124q23-23 57-23t57 23q23 23 23 56.5T822-709L697-584l68 384-85 85-136-317-102 102 26 144-71 71Z" /></svg>

                </div>
            </div>



           
        </div>








    </>)
}