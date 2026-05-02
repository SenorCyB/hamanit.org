# Haman IT Solutions — hamanit.org

Source for [hamanit.org](https://hamanit.org), the website for Haman IT Solutions — a locally owned IT and technology services company in Katy, TX, serving Greater Houston.

## Services

- **IT Support & Repair** — diagnostics, malware removal, OS reinstalls, network triage
- **Custom PC Builds** — part selection, assembly, stress-testing, handoff
- **Business Websites** — fast, mobile-first, custom-coded (this site is the kind of work we ship)
- **AI Consulting & Automation** — practical AI integration and workflow automation

## Stack

- Hand-written HTML / CSS / JavaScript — no build step, no framework
- Deployed via GitHub Pages with custom domain (CNAME → hamanit.org)
- Contact form via Formspree
- Inter-page state (theme preference, boot-screen seen flag) in localStorage / sessionStorage

## Local development

```bash
python -m http.server 8765
# then open http://localhost:8765/
```

The `.claude/launch.json` wires this up for the in-editor preview.

## Contact

support@hamanit.org · (832) 388-2401
