"use client";

import React from 'react'
import { Button } from './ui'
import { useLanguage } from '../context/LanguageContext'

function StorySection() {
  const { t } = useLanguage()

  return <section className="story">
    <div className="story-copy">
      <small>{t('story.label')}</small>
      <h2>{t('story.headline1')}<br/>{t('story.headline2')}</h2>
      <div className="gold-line"/>
      <p>{t('story.p1')}</p>
      <p>{t('story.p2')}</p>
      <Button outline>{t('story.cta')}</Button>
    </div>
    <div className="story-visual">
      <img src="/images/senara-story.png" alt="Pineapple and clinical glassware"/>
      <div className="seal">{t('story.seal1')}<br/><b>{'\u2727'}</b><br/>{t('story.seal2')}</div>
    </div>
  </section>
}

export default StorySection
