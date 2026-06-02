import React from 'react'
import { Button } from './ui'

function StorySection() {
  return <section className="story">
    <div className="story-copy">
      <small>OUR STORY</small>
      <h2>Rooted in Nature.<br/>Backed by Science.</h2>
      <div className="gold-line"/>
      <p>Senara is a premium skincare brand that harnesses the power of pineapple-derived actives and botanical extracts to deliver gentle yet effective care.</p>
      <p>Every formula is thoughtfully crafted with clean, skin-loving ingredients, and clinically tested for visible results.</p>
      <Button outline>Learn More About Us</Button>
    </div>
    <div className="story-visual">
      <img src="/images/senara-story.png" alt="Pineapple and clinical glassware"/>
      <div className="seal">NATURE MEETS<br/><b>{'\u2727'}</b><br/>SCIENCE</div>
    </div>
  </section>
}

export default StorySection
