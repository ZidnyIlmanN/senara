import React from 'react'

function TestimonialSection() {
  return <section className="testimonial container">
    <img className="portrait" src="/images/Testimonial/senara-testimonial1.png" alt="Testimonial"/>
    <div className="quote">
      <div className="quote-mark">{'\u201c'}</div>
      <blockquote>My skin feels brighter, softer, and<br/>deeply hydrated after just a few days.<br/>I can actually see the glow coming back.</blockquote>
      <cite>{'\u2014'} Olivia Tan</cite>
      <div className="proof-row">
        <div className="avatars"><span>O</span><span>S</span><span>M</span></div>
        <p><b>1k+ happy customers</b><br/>and counting</p>
      </div>
      <div className="slider-nav"><button>{'\u2190'}</button><button>{'\u2192'}</button></div>
    </div>
  </section>
}

export default TestimonialSection
