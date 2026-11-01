# Sidharth Anupkrishnan — personal website

A static academic website with a simple ivory and burgundy design and readable typography. Live URL: https://sidharthanup.github.io/.

## Edit and preview

Update `content.json`, then run `node build.mjs` to regenerate `index.html`. Presentation is in `styles.css`. Navigation wraps on small screens without JavaScript. There are no package dependencies or external font requests.

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173/.

The downloadable CV is `assets/Sidharth_Anupkrishnan_CV.pdf`. Replace it with a newer PDF to update it. Publicly available E3Sense and EMG-FM-Bench preprints are linked; local manuscripts and the transcript are not copied into this project.

The current downloadable CV is copied from `../latex_cv/Sid_Resume.pdf`. After replacing the PDF, run `node build.mjs` to refresh the versioned CV links and avoid stale browser caches.

## Publish to GitHub Pages

1. Create the public repository `sidharthanup/sidharthanup.github.io`.
2. Push the files in this directory to its `main` branch.
3. In **Settings → Pages**, set **Source** to **Deploy from a branch**, then choose **main** and **/ (root)** and save.
4. Verify the deployment at https://sidharthanup.github.io/.

The committed `index.html` is ready to serve. `.nojekyll` disables Jekyll processing; no build service or GitHub Actions configuration is required. Regenerate and commit `index.html` after changes to `content.json`.

GitHub documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
