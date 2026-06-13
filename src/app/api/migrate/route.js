import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { allProducts } from '../../../data/products';
import idTranslations from '../../../translations/id';

export async function GET() {
  try {
    console.log('Starting migration...');

    // 1. Migrate Products
    for (const product of allProducts) {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          short_desc: product.shortDesc,
          desc: product.desc,
          price: product.price,
          image: product.image,
          badge: product.badge,
          badge_style: product.badgeStyle,
          type: product.type,
          conditions: product.conditions,
          ingredients: product.ingredients,
          volume: product.volume,
          benefits: product.benefits,
          how_to_use: product.howToUse,
          full_ingredients: product.fullIngredients,
          rating: product.rating,
          reviews_count: product.reviewsCount,
          stock: 100 // Default stock
        });
      
      if (error) {
        console.error('Error migrating product:', product.name, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    console.log('Products migrated successfully.');

    // 2. Migrate About Sections
    const aboutContentData = [
      {
        id: 'roots',
        title: idTranslations.aboutPage.roots.title,
        desc: idTranslations.aboutPage.roots.desc,
        content: {
          feature1_title: idTranslations.aboutPage.roots.feature1_title,
          feature1_desc: idTranslations.aboutPage.roots.feature1_desc,
          feature2_title: idTranslations.aboutPage.roots.feature2_title,
          feature2_desc: idTranslations.aboutPage.roots.feature2_desc,
          quote: idTranslations.aboutPage.roots.quote
        }
      },
      {
        id: 'process',
        title: idTranslations.aboutPage.process.title,
        desc: idTranslations.aboutPage.process.desc,
        content: {
          step1_title: idTranslations.aboutPage.process.step1_title,
          step1_desc: idTranslations.aboutPage.process.step1_desc,
          step2_title: idTranslations.aboutPage.process.step2_title,
          step2_desc: idTranslations.aboutPage.process.step2_desc,
          step3_title: idTranslations.aboutPage.process.step3_title,
          step3_desc: idTranslations.aboutPage.process.step3_desc,
        }
      },
      {
        id: 'sustainability',
        title: idTranslations.aboutPage.sustainability.title,
        desc: idTranslations.aboutPage.sustainability.desc,
        content: {
          feature1_title: idTranslations.aboutPage.sustainability.feature1_title,
          feature1_desc: idTranslations.aboutPage.sustainability.feature1_desc,
          feature2_title: idTranslations.aboutPage.sustainability.feature2_title,
          feature2_desc: idTranslations.aboutPage.sustainability.feature2_desc,
        }
      },
      {
        id: 'founder',
        title: idTranslations.aboutPage.founder.title,
        desc: idTranslations.aboutPage.founder.desc,
        content: {
          name: idTranslations.aboutPage.founder.name,
          quote: idTranslations.aboutPage.founder.quote,
        }
      }
    ];

    for (const section of aboutContentData) {
      const { error } = await supabase
        .from('about_content')
        .upsert(section);
      
      if (error) {
        console.error('Error migrating about section:', section.id, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    console.log('About sections migrated successfully.');

    // 3. Migrate Timeline Events
    for (let i = 0; i < idTranslations.aboutPage.storyPoints.length; i++) {
      const point = idTranslations.aboutPage.storyPoints[i];
      const { error } = await supabase
        .from('timeline_events')
        .upsert({
          id: point.id,
          year: point.year,
          month: point.month,
          date: point.date,
          title: point.title,
          desc: point.desc,
          image_captions: {
            caption1: point.caption1,
            caption2: point.caption2,
            caption3: point.caption3,
            caption4: point.caption4,
            caption5: point.caption5
          },
          order_index: i
        });
      
      if (error) {
        console.error('Error migrating timeline event:', point.id, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    console.log('Timeline events migrated successfully.');

    return NextResponse.json({ success: true, message: 'All data migrated successfully to Supabase!' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
