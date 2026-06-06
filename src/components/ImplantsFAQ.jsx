import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ImplantsFAQ = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const faqCategories = [
    {
      title: '🔹 BASICS (Curiosity + Awareness)',
      questions: [
        {
          id: 'basics-1',
          q: 'What exactly is a dental implant (in simple words)?',
          a: 'A dental implant is an artificial tooth root made of titanium that is surgically placed into your jawbone. Once integrated with the bone, it serves as a sturdy foundation for a replacement tooth (crown). Think of it as a permanent replacement that works and feels like a natural tooth.'
        },
        {
          id: 'basics-2',
          q: 'Do I really need to replace a missing tooth… or can I ignore it?',
          a: 'While you can technically live with a missing tooth, ignoring it leads to serious complications. A missing tooth affects your bite, causes adjacent teeth to shift, impairs your speech and eating ability, and negatively impacts your facial aesthetics and confidence. It\'s best to replace it promptly.'
        },
        {
          id: 'basics-3',
          q: 'What actually happens if I leave a gap for months or years?',
          a: 'Leaving a gap for extended periods causes: bone loss in the jawbone (which accelerates over time), adjacent teeth tilting into the gap, bite misalignment, difficulty chewing properly, potential gum disease, and accelerated aging of the face as jaw structure deteriorates. The longer you wait, the more complex and costly the treatment becomes.'
        },
        {
          id: 'basics-4',
          q: 'Does missing a tooth slowly cause bone loss in the jaw?',
          a: 'Yes, absolutely. When a tooth is lost, the jawbone that supported it loses its stimulation and begins to resorb (deteriorate) at a rate of 25% in the first year, and continues declining thereafter. This bone loss can make future implant placement more difficult and may require bone grafting. Implants are unique because they preserve bone by stimulating it, just like natural teeth.'
        },
        {
          id: 'basics-5',
          q: 'Is a bridge damaging my healthy teeth over time?',
          a: 'Yes, traditional bridges can be problematic long-term. A bridge requires grinding down healthy adjacent teeth to serve as anchors, permanently damaging them. Over time, these anchor teeth often develop cavities or fail. Additionally, bridges don\'t prevent bone loss under the missing tooth area. Implants are superior because they preserve adjacent teeth and bone.'
        },
        {
          id: 'basics-6',
          q: 'Implant vs bridge — which is truly better long-term?',
          a: 'Implants are superior long-term. While bridges are less expensive upfront, implants offer: no damage to healthy teeth, preservation of jawbone, longevity (20+ years vs 10 years for bridges), better aesthetics, natural function, easier hygiene, and true permanence. Implants have a higher initial cost but provide exceptional value over time.'
        }
      ]
    },
    {
      title: '🔹 FEAR BREAKERS (Viral + Conversion Core)',
      questions: [
        {
          id: 'fear-1',
          q: 'Are dental implants painful… honestly?',
          a: 'The implant procedure itself is not painful because we use local anesthesia to numb the area completely. During surgery, you may feel pressure and vibration but no pain. Post-operative discomfort is typically mild to moderate (like a dental extraction) and manageable with prescribed pain medication for 3-7 days. Most patients are pleasantly surprised at how minimal the pain is.'
        },
        {
          id: 'fear-2',
          q: 'Is implant surgery safe or risky?',
          a: 'Dental implant surgery is very safe when performed by a qualified and trained implantologist. Serious complications are rare (less than 2%). Common side effects like swelling and bruising are temporary. We take detailed 3D scans (CBCT) before surgery to avoid nerves and sinuses, use sterilized surgical equipment, and follow strict protocols. The success rate exceeds 95% in most cases.'
        },
        {
          id: 'fear-3',
          q: 'What if I\'m extremely scared of dental treatment?',
          a: 'We completely understand dental anxiety. We offer sedation options including twilight sedation to help you relax during the procedure. You can discuss your fears with our team, and we\'ll create a comfortable environment. Many anxious patients find that implant surgery is less intimidating than expected because we take time to explain everything and ensure your comfort throughout.'
        },
        {
          id: 'fear-4',
          q: 'Is the whole implant process stressful or complicated?',
          a: 'The implant process is straightforward and well-organized. We provide detailed timelines, explain each step, and answer all your questions. Most patients find it less stressful than they anticipated. The process is predictable: initial consultation → implant placement (one visit) → waiting period (osseointegration) → crown placement. Our team guides you through each phase with clear instructions.'
        },
        {
          id: 'fear-5',
          q: 'What is the #1 fear patients have before implants?',
          a: 'The most common fear is "Will it hurt?" Patients worry about the surgical procedure and recovery. However, once they experience it, most realize that the reality is far less painful than their imagination. Local anesthesia, modern techniques, and proper pain management make the experience remarkably comfortable. Post-procedure discomfort is minimal and temporary.'
        },
        {
          id: 'fear-6',
          q: 'What do patients usually say right after it\'s done?',
          a: '"That was easier than I expected!" and "I\'m so glad I did this!" are common reactions. Most patients are amazed at how quick and painless the procedure was. They feel relieved that the waiting is over and excited about their new tooth. Many report confidence restoration and improved quality of life within weeks.'
        }
      ]
    },
    {
      title: '🔹 RESULTS & CONFIDENCE (Desire + Transformation)',
      questions: [
        {
          id: 'results-1',
          q: 'Will implants look completely natural?',
          a: 'Yes, absolutely. Modern implant crowns are crafted to match your natural teeth perfectly in color, shape, and translucency. Using high-quality ceramic materials and advanced shade-matching techniques, even trained dentists cannot distinguish an implant crown from a natural tooth when viewed from normal distances. Your smile will look completely authentic and beautiful.'
        },
        {
          id: 'results-2',
          q: 'Will it feel like my real teeth while eating and speaking?',
          a: 'Implants feel remarkably similar to natural teeth because they\'re anchored directly to the bone, not relying on surrounding teeth for support. You can eat all your favorite foods without restrictions, speak clearly without lisping, and experience full sensory feedback. The "artificial" feeling, if any, typically disappears within weeks as your brain adapts.'
        },
        {
          id: 'results-3',
          q: 'Can I smile confidently again without hesitation?',
          a: 'Absolutely. Implants restore not just your teeth but your confidence and quality of life. You\'ll no longer feel self-conscious about your smile, can laugh freely, take photos without covering your mouth, and enjoy social interactions without anxiety. This psychological transformation is often as valuable as the dental restoration itself.'
        },
        {
          id: 'results-4',
          q: 'Do implants actually stop further bone loss?',
          a: 'Yes, implants actively prevent bone loss. Unlike bridges or dentures which allow bone to deteriorate, implants stimulate the jawbone during chewing, just like natural tooth roots do. This stimulation preserves bone density and prevents the "sunken face" appearance that occurs with missing teeth. Implants essentially maintain your facial structure and youthfulness.'
        },
        {
          id: 'results-5',
          q: 'Are implants a permanent solution or temporary?',
          a: 'Implants are designed to be a permanent solution. The titanium implant itself typically lasts a lifetime with proper care. The crown may need replacement after 15-20 years due to normal wear, but the implant foundation remains stable. With excellent oral hygiene and regular dental visits, your implant can function for life, making it the most permanent tooth replacement option available.'
        },
        {
          id: 'results-6',
          q: 'How long do implants really last in real life?',
          a: 'Clinical studies show implant success rates of 95-98% over 10+ years. Most patients keep their implants for 20-30+ years without problems. The implant itself rarely fails; longevity depends on bone health, oral hygiene, and lifestyle factors. Smokers and those with poor oral care may have reduced longevity. With proper maintenance, many implants function successfully for a lifetime.'
        }
      ]
    },
    {
      title: '🔹 ELIGIBILITY (Smart Lead Qualification)',
      questions: [
        {
          id: 'eligibility-1',
          q: 'Am I the right candidate for dental implants?',
          a: 'Most people are candidates for implants if they: have adequate jawbone (or are willing to do a bone graft), are in good general health, practice good oral hygiene, have healthy gums, and are non-smokers (or willing to quit). Age is not a limiting factor—we successfully place implants in patients from their 20s to their 80s. A consultation will determine your suitability.'
        },
        {
          id: 'eligibility-2',
          q: 'Am I too old for this treatment?',
          a: 'Absolutely not. Age is not a barrier to implants. We successfully place implants in patients in their 70s, 80s, and even 90s. As long as you\'re in reasonably good health and your jawbone is adequate, age is not a limiting factor. Many older patients choose implants because they offer superior longevity and quality of life compared to other options.'
        },
        {
          id: 'eligibility-3',
          q: 'Can smokers still safely get implants?',
          a: 'Smokers can get implants, but with important considerations. Smoking reduces healing ability and increases implant failure risk by 2-3 times. We require smokers to quit or significantly reduce smoking before implant placement and during the healing period (at least 3 months). If you\'re willing to quit, implants are still possible. Quitting smoking also improves overall health and implant longevity.'
        },
        {
          id: 'eligibility-4',
          q: 'I\'ve been missing a tooth for years — is it too late now?',
          a: 'It\'s never too late, though earlier treatment is generally better. Long-standing tooth gaps result in significant bone loss, which may require bone grafting before implant placement. While this adds complexity and cost, it\'s completely manageable. Many patients successfully get implants even after decades of missing teeth. We\'ll assess your bone level and create an appropriate treatment plan.'
        },
        {
          id: 'eligibility-5',
          q: 'What if I already have bone loss — can implants still be done?',
          a: 'Yes, bone loss doesn\'t disqualify you from implants. Depending on the extent of loss, we have several options: using short implants (6-8mm), placing implants in remaining bone without grafting, or performing bone grafting to rebuild lost bone. Your 3D scans will determine the best approach. Most patients with bone loss are successfully treated through appropriate planning.'
        },
        {
          id: 'eligibility-6',
          q: 'Will I need a bone graft before getting implants?',
          a: 'Not everyone needs a bone graft. We assess your bone volume using 3D imaging. If you have adequate bone (minimum 5-6mm width, 10mm height), implants can be placed directly. Bone grafting is recommended when bone loss is significant. If needed, grafting typically takes 3-6 months to integrate before implant placement. We discuss this during your consultation.'
        }
      ]
    },
    {
      title: '🔹 PROCEDURE & RECOVERY (Remove Uncertainty)',
      questions: [
        {
          id: 'procedure-1',
          q: 'What actually happens during the implant procedure?',
          a: 'The procedure involves: numbing the area with local anesthesia, making a small incision in the gum, drilling a precise hole in the bone, inserting the titanium implant, closing the gum with sutures, and allowing healing (osseointegration) for 3-6 months. Once healed, we place an abutment and crown. The surgical portion is typically completed in 1-2 hours.'
        },
        {
          id: 'procedure-2',
          q: 'How long does the full treatment take from start to finish?',
          a: 'Total treatment time is typically 6-9 months. Initial consultation and planning: 1-2 weeks. Implant placement: 1 day. Osseointegration (healing): 3-6 months. Crown placement: 2-3 weeks. Some advanced techniques can compress this timeline to 3-4 months. Factors like bone grafting or complex cases may extend the timeline. We\'ll provide a specific schedule during consultation.'
        },
        {
          id: 'procedure-3',
          q: 'How many visits will I need?',
          a: 'Most patients need 4-5 visits: Initial consultation and imaging, implant placement surgery, suture removal (7-10 days), abutment placement and impression (after osseointegration), and crown placement. Additional visits may be needed for bone grafting or complex cases. We schedule all appointments in advance so you can plan accordingly. Each appointment is typically 30-90 minutes.'
        },
        {
          id: 'procedure-4',
          q: 'Will there be pain or swelling after the surgery?',
          a: 'Mild to moderate swelling is normal and peaks around day 2-3, then subsides over 7-10 days. Some bruising and discomfort are expected but typically managed well with prescribed pain medication (usually needed for 3-7 days). Ice application helps reduce swelling. Most patients report manageable discomfort, not severe pain. Swelling and bruising gradually fade over 2-3 weeks.'
        },
        {
          id: 'procedure-5',
          q: 'How quickly can I get back to normal life and work?',
          a: 'Most patients return to desk work within 2-3 days. Light activities resume after 1 week. Strenuous exercise and heavy lifting are restricted for 2-3 weeks to allow proper healing. You\'ll need to be careful with the surgical site, avoiding hot foods and smoking. Most people feel "back to normal" within 2-3 weeks, though complete healing takes 3-6 months.'
        },
        {
          id: 'procedure-6',
          q: 'Is bone grafting painful or difficult?',
          a: 'Bone grafting is not painful because we use local anesthesia. The procedure is straightforward and typically takes 45-90 minutes. If graft material comes from your own bone (most effective), we harvest it from another mouth area. You may experience similar post-operative effects as implant surgery: mild swelling and discomfort for several days. Recovery is comparable to implant placement.'
        },
        {
          id: 'procedure-7',
          q: 'When can I eat normally again without restrictions?',
          a: 'For the first 2 weeks, stick to soft foods (yogurt, soup, mashed potatoes, smoothies) to protect the surgical site. After 2-3 weeks, you can gradually return to normal foods. Hard and sticky foods should be avoided for 4-6 weeks. Once your crown is placed and osseointegration is complete, you can eat virtually anything normally. Most patients resume their full diet within 4-6 weeks.'
        }
      ]
    },
    {
      title: '🔹 COST & VALUE (Decision Trigger)',
      questions: [
        {
          id: 'cost-1',
          q: 'Are implants expensive… or actually worth the investment?',
          a: 'Implants have a higher upfront cost ($3,000-6,000+) compared to bridges or dentures. However, they\'re exceptional value long-term: they last 20-30+ years (vs 10 years for bridges), preserve bone and facial structure, require minimal maintenance, and restore confidence and quality of life. Calculate the cost per year over 20+ years—implants become very cost-effective. Most patients consider it a worthwhile investment in their health and happiness.'
        },
        {
          id: 'cost-2',
          q: 'Why do implants cost more than bridges or dentures?',
          a: 'Implants cost more because: they involve surgical expertise and advanced technology, require precision 3D planning, use biocompatible titanium materials, demand meticulous surgical technique, and provide superior longevity and outcomes. Bridges damage healthy teeth (hidden cost), and dentures require frequent adjustments and replacements. While implants have higher upfront costs, they save money and problems long-term.'
        },
        {
          id: 'cost-3',
          q: 'Does bone grafting increase the overall cost?',
          a: 'Yes, bone grafting adds $800-3,000+ to the total cost depending on graft size and material. However, it\'s an investment that enables implant placement when bone loss would otherwise make implants impossible. We use the most cost-effective graft materials (synthetic or donor bone) when appropriate. Some insurance may partially cover grafting, so inquire about your plan. We discuss all cost options during consultation.'
        },
        {
          id: 'cost-4',
          q: 'Is this a one-time solution or will I need repeated treatments?',
          a: 'Implants are essentially a one-time solution. The titanium implant lasts a lifetime with proper care. The crown may need replacement after 15-20 years due to wear, but the implant foundation remains stable. Unlike bridges (which fail after 10 years), dentures (which require constant adjustments), or additional extractions (which compound problems), implants provide long-term stability. Your investment protects you for decades.'
        }
      ]
    },
    {
      title: '🔹 ADVANCED / HIGH-TICKET CASES (Authority Positioning)',
      questions: [
        {
          id: 'advanced-1',
          q: 'Can implants replace multiple missing teeth at once?',
          a: 'Yes, absolutely. We regularly replace 2-3 missing teeth with implants. Multiple implants work beautifully and provide excellent stability and aesthetics. Each implant functions independently, preserving natural bone. For multiple teeth, we may place 2-3 implants strategically to support multiple crowns efficiently. This is more durable and aesthetic than bridges while preserving all remaining natural teeth.'
        },
        {
          id: 'advanced-2',
          q: 'What if I need full mouth replacement?',
          a: 'Full mouth replacement is absolutely possible with implants. Treatment options include: traditional full-mouth implants (8-10 implants supporting individual crowns), implant-supported bridges (4-6 implants supporting multiple crowns), or implant-supported dentures (4-6 implants holding a denture securely). Modern techniques like "All-on-4" or "All-on-6" enable comprehensive restoration in complex cases. We create custom solutions based on your needs and bone availability.'
        },
        {
          id: 'advanced-3',
          q: 'Can full mouth implants be done even with severe bone loss?',
          a: 'Yes, even severe bone loss doesn\'t prevent full mouth implants. Options include: extensive bone grafting before implant placement (ideal but longer treatment), using shorter implants (6-8mm) strategically placed in remaining bone, tilted implants that maximize available bone, or zygomatic implants anchored to cheekbone (for extreme cases). Advanced techniques and planning enable successful treatment even in challenging situations. Your 3D scans guide the optimal approach.'
        },
        {
          id: 'advanced-4',
          q: 'Are there options like fixed teeth in 3–5 days?',
          a: 'Yes, advanced techniques like "All-on-4" or "Teeth in a Day" enable rapid restoration. These involve placing 4-6 implants and provisionally mounting a bridge or denture on the same day or within 48-72 hours. Within 3-6 months, once implants fully integrate, we replace the provisional restoration with a permanent one. These techniques provide immediate function and appearance while implants heal. However, candidacy depends on bone quality and quantity. We assess feasibility during consultation.'
        }
      ]
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[color:var(--soft)] border border-[color:var(--teal)]/10 shadow-sm text-[color:var(--teal)] text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <span className="w-3 h-3 rounded-full bg-[color:var(--teal)] animate-pulse" />
            Dental Implants FAQ
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[color:var(--dk)] mb-6 leading-tight">
            Your <span className="italic text-[color:var(--teal)]">Implant Questions</span> Answered
          </h2>
          <p className="text-[color:var(--muted)] max-w-3xl mx-auto text-lg leading-relaxed">
            Everything you need to know about dental implants — from basics and fears to results and advanced cases. We've compiled comprehensive answers to help you make an informed decision.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <div key={category.title} className="border-l-4 border-[color:var(--teal)] pl-6">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--dk)] mb-8">
                {category.title}
              </h3>

              {/* Questions in Category */}
              <div className="space-y-4">
                {category.questions.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-black/5 rounded-2xl overflow-hidden bg-[color:var(--soft)]/30 hover:border-[color:var(--teal)]/20 transition-all duration-300"
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 md:px-8 md:py-6 flex items-start justify-between gap-4 hover:bg-[color:var(--soft)]/50 transition-colors text-left"
                    >
                      <h4 className="text-base md:text-lg font-bold text-[color:var(--dk)] leading-relaxed pr-4">
                        {faq.q}
                      </h4>
                      <span
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-[color:var(--teal)]/10 flex items-center justify-center text-[color:var(--teal)] font-bold text-lg flex-shrink-0 transition-transform duration-300 ${
                          expandedId === faq.id ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Answer Section */}
                    {expandedId === faq.id && (
                      <div className="px-6 py-6 md:px-8 md:py-8 border-t border-black/5 bg-white">
                        <p className="text-[color:var(--muted)] leading-relaxed text-base md:text-lg">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 p-10 md:p-16 rounded-3xl bg-gradient-to-r from-[color:var(--teal)]/10 via-white to-[color:var(--soft)] border border-[color:var(--teal)]/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">
              Still Have Questions?
            </h3>
            <p className="text-[color:var(--muted)] mb-8 leading-relaxed">
              Schedule a free consultation with our implant specialists. We'll assess your specific situation and create a personalized treatment plan tailored to your needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="inline-block bg-[color:var(--teal)] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[color:var(--dk)] transition-all shadow-lg shadow-[color:var(--teal)]/20 active:scale-95"
              >
                Book Your Consultation
              </a>
              <a
                href="https://wa.me/919037151894"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-[color:var(--teal)] text-[color:var(--teal)] px-10 py-4 rounded-2xl font-bold hover:bg-[color:var(--soft)] transition-all"
              >
                Chat with Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImplantsFAQ;

