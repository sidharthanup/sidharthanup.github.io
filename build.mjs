import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const data = JSON.parse(await readFile(new URL('./content.json', import.meta.url), 'utf8'));
const styleVersion = createHash('sha256').update(await readFile(new URL('./styles.css', import.meta.url))).digest('hex').slice(0, 12);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const link = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`;
const links = items => items?.length ? `<p class="entry-links">${items.map(l => link(l.url, l.label)).join(' · ')}</p>` : '';
const research = data.currentResearch.map(r => `<article class="entry">
  <div class="entry-heading"><h3>${escape(r.title)}</h3><p class="date">${escape(r.period)}</p></div>
  ${r.collaboration ? `<p class="metadata">In collaboration with ${escape(r.collaboration)}</p>` : ''}
  <p>${escape(r.description)}</p>
</article>`).join('\n');
const manuscripts = data.manuscripts.map(p => `<article class="entry paper">
  <h3>${escape(p.title)}</h3>
  <p class="metadata">${escape(p.role)} · ${p.year}<br>${escape(p.status)}</p>
  <p>${escape(p.description)}</p>
  ${links(p.links.map(l => ({...l, label:l.label + ' preprint'})))}
</article>`).join('\n');
const experience = data.experience.map(e => `<article class="entry">
  <div class="entry-heading"><h3>${escape(e.organization)}</h3><p class="date">${escape(e.period)}</p></div>
  <p class="position">${escape(e.role)}${e.location ? ' · ' + escape(e.location) : ''}</p>
  <p>${escape(e.description)}</p>
  ${links(e.links)}
</article>`).join('\n');
const education = data.education.map(e => `<article class="entry education-item">
  <div class="entry-heading"><h3>${escape(e.degree)}</h3><p class="date">${escape(e.period)}</p></div>
  <p>${escape(e.institution)}</p>
</article>`).join('\n');
const skills = Object.entries(data.skills).map(([name, values]) => `<div class="skill-group"><h3>${escape(name)}</h3><p>${values.map(escape).join(', ')}</p></div>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#faf8f4">
  <title>Sidharth Anupkrishnan — Wearable Sensing &amp; Machine Learning</title>
  <meta name="description" content="Sidharth Anupkrishnan is a Computer Science PhD researcher at UMass Amherst studying wearable sensing, biosignals, multimodal machine learning, and human engagement.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sidharth Anupkrishnan">
  <meta property="og:description" content="Wearable sensing, biosignals, and machine learning. PhD researcher at UMass Amherst.">
  <meta property="og:url" content="https://sidharthanup.github.io/">
  <link rel="canonical" href="https://sidharthanup.github.io/">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="styles.css?v=${styleVersion}">
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <header class="wrap site-header">
    <nav aria-label="Main navigation">
      <a href="#about">About</a><a href="#research">Research</a><a href="#writing">Papers</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a href="assets/Sidharth_Anupkrishnan_CV.pdf">CV</a>
    </nav>
  </header>
  <main id="main" class="wrap">
    <section id="about" class="about" aria-labelledby="name">
      <div class="about-copy">
        <h1 id="name">${escape(data.name)}</h1>
        <p>I'm a PhD student in Computer Science at the University of Massachusetts Amherst, advised by <a href="https://people.cs.umass.edu/~phuc/">Prof. VP Nguyen</a>.</p>
        <p>${escape(data.intro)}</p>
        <p class="profile-links">${link('mailto:' + data.email, 'Email')}${link('assets/Sidharth_Anupkrishnan_CV.pdf', 'CV')}${link(data.github, 'GitHub')}${link(data.linkedin, 'LinkedIn')}</p>
      </div>
      <img class="portrait" src="assets/Sid.jpg" alt="Sidharth Anupkrishnan" width="933" height="1400" fetchpriority="high">
    </section>
    <section id="research" class="section" aria-labelledby="research-title">
      <h2 id="research-title">Current research</h2>
      ${research}
    </section>
    <section id="writing" class="section" aria-labelledby="writing-title">
      <h2 id="writing-title">Papers and preprints</h2>
      ${manuscripts}
    </section>
    <section id="experience" class="section" aria-labelledby="experience-title">
      <h2 id="experience-title">Experience</h2>
      ${experience}
    </section>
    <section id="education" class="section" aria-labelledby="education-title">
      <h2 id="education-title">Education</h2>
      ${education}
    </section>
    <section class="section" aria-labelledby="skills-title">
      <h2 id="skills-title">Technical skills</h2>
      ${skills}
    </section>
    <section id="contact" class="section contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Contact</h2>
      <p>${link('mailto:' + data.email, data.email)}</p>
      <p>${link(data.github, 'GitHub')} · ${link(data.linkedin, 'LinkedIn')}</p>
    </section>
  </main>
  <footer class="wrap"><p>© 2026 ${escape(data.name)}</p></footer>
</body>
</html>`;
await writeFile(new URL('./index.html', import.meta.url), html);
console.log('Built index.html from content.json.');
