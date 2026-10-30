import { readFile, writeFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('./content.json', import.meta.url), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const link = (url, label, cls = '') => `<a class="${cls}" href="${escape(url)}">${escape(label)} ${arrow}</a>`;
const research = data.currentResearch.map((r, i) => `<article class="research-row"><span class="row-number" aria-hidden="true">0${i + 1}</span><div><p class="eyebrow">${escape(r.period)}</p><h3>${escape(r.title)}</h3>${r.collaboration ? `<p class="collaborator">With ${escape(r.collaboration)}</p>` : ''}</div><p class="research-description">${escape(r.description)}</p></article>`).join('\n');
const manuscripts = data.manuscripts.map((p, i) => `<article class="paper"><div class="paper-index" aria-hidden="true">0${i + 1}</div><div><div class="paper-meta"><span>${escape(p.role)}</span><span>${p.year}</span></div><h3>${escape(p.title)}</h3><p class="paper-status">${escape(p.status)}</p><p>${escape(p.description)}</p>${p.links.length ? `<div class="paper-links">${p.links.map(l => link(l.url, l.label + ' preprint', 'text-link')).join('')}</div>` : ''}</div></article>`).join('\n');
const experience = data.experience.map(e => `<article class="timeline-item"><p class="eyebrow">${escape(e.period)}</p><h3>${escape(e.organization)}</h3><p class="position">${escape(e.role)}${e.location ? ' · ' + escape(e.location) : ''}</p><p>${escape(e.description)}</p></article>`).join('\n');
const education = data.education.map(e => `<article class="education-item"><h4>${escape(e.degree)}</h4><p>${escape(e.institution)}</p><p class="small muted">${escape(e.period)}</p></article>`).join('\n');
const skills = Object.entries(data.skills).map(([name, values]) => `<div class="skill-group"><h3>${escape(name)}</h3><p>${values.map(escape).join(' · ')}</p></div>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f5ef">
  <title>Sidharth Anupkrishnan — Wearable Sensing &amp; Machine Learning</title>
  <meta name="description" content="Sidharth Anupkrishnan is a Computer Science PhD researcher at UMass Amherst studying wearable sensing, biosignals, multimodal machine learning, and human engagement.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sidharth Anupkrishnan">
  <meta property="og:description" content="Wearable sensing, biosignals, and machine learning. PhD researcher at UMass Amherst.">
  <meta property="og:url" content="https://sidharthanup.github.io/">
  <link rel="canonical" href="https://sidharthanup.github.io/">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <header class="site-header"><div class="header-inner">
    <a class="wordmark" href="#about" aria-label="Sidharth Anupkrishnan, home"><span class="monogram" aria-hidden="true">sa.</span><span>Sidharth Anupkrishnan</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">☰</span></button>
    <nav id="primary-nav" aria-label="Main navigation"><a href="#research">Research</a><a href="#writing">Writing</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a class="nav-cv" href="assets/Sidharth_Anupkrishnan_CV.pdf">CV ${arrow}</a></nav>
  </div></header>
  <main id="main">
    <section id="about" class="hero wrap" aria-labelledby="name">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow"><span class="status-dot" aria-hidden="true"></span> Computer Science · UMass Amherst</p>
        <h1 id="name">Sidharth<br><em>Anupkrishnan.</em></h1>
        <p class="hero-subtitle">Understanding people.<br>Through the signals we wear.</p>
        <p class="intro">${escape(data.intro)}</p>
        <p class="advisor">PhD researcher, advised by <a href="https://people.cs.umass.edu/~phuc/">Prof. VP Nguyen</a>.</p>
        <div class="hero-actions">${link('assets/Sidharth_Anupkrishnan_CV.pdf', 'View my CV', 'button')} ${link('mailto:' + data.email, 'Get in touch', 'text-link')}</div>
      </div>
      <div class="hero-visual">
      <figure class="portrait"><img src="assets/Sid.jpg" alt="Sidharth Anupkrishnan" width="933" height="1400" fetchpriority="high"><figcaption>Sidharth Anupkrishnan <span>UMass Amherst</span></figcaption></figure>
      </div>
    </section>
    <div class="interest-strip wrap" aria-label="Research interests">${data.researchInterests.map(t => `<span>${escape(t)}</span>`).join('')}</div>
    <section id="research" class="section wrap" aria-labelledby="research-title"><div class="section-heading"><div><p class="eyebrow">01 / In progress</p><h2 id="research-title">Current research</h2></div><p>From physiological signals<br>to real-world understanding.</p></div><div class="research-list">${research}</div></section>
    <section id="writing" class="writing-section"><div class="wrap section"><div class="section-heading"><div><p class="eyebrow">02 / Research &amp; writing</p><h2 id="writing-title">Selected manuscripts</h2></div><p>Wearable systems, human engagement,<br>and foundation model evaluation.</p></div><div class="paper-list">${manuscripts}</div></div></section>
    <section id="experience" class="section wrap" aria-labelledby="experience-title"><div class="section-heading"><div><p class="eyebrow">03 / The path so far</p><h2 id="experience-title">Experience &amp; education</h2></div></div><div class="background-grid"><div class="experience-list">${experience}</div><aside class="education"><p class="eyebrow">Education</p>${education}<div class="education-note"><span aria-hidden="true">↗</span><p>From mechanical engineering and distributed systems to wearable sensing.</p></div></aside></div></section>
    <section class="tools-section wrap" aria-labelledby="tools-title"><p class="eyebrow">The toolkit</p><h2 id="tools-title">Across signals, software &amp; systems.</h2><div class="skills-grid">${skills}</div></section>
    <section id="contact" class="contact-section"><div class="wrap contact-inner"><div><p class="eyebrow">04 / Say hello</p><h2>Let’s connect.</h2><p>Interested in wearable sensing, biosignals,<br>or multimodal machine learning? I’d love to hear from you.</p></div><div class="contact-links">${link('mailto:' + data.email, data.email, 'email-link')}<div>${link(data.github, 'GitHub', 'text-link')} ${link(data.linkedin, 'LinkedIn', 'text-link')} ${link('assets/Sidharth_Anupkrishnan_CV.pdf', 'CV', 'text-link')}</div></div></div></section>
  </main>
  <footer class="wrap site-footer"><p>© 2026 ${escape(data.name)}</p><p>Amherst, Massachusetts <span aria-hidden="true">·</span> <a href="#about">Back to top ↑</a></p></footer>
</body>
</html>`;
await writeFile(new URL('./index.html', import.meta.url), html);
console.log('Built index.html from content.json.');
