---
# Leave the homepage title empty to use the site title
title: ''
date: 2026-02-04
type: landing
image:
  filename: "featured.png"
  alt_text: "Herzog Lab | Epigenetics, Ageing & Stem Cells"

design:
  # Default section spacing
  spacing: '5rem'

sections:
  - block: hero
    id: about
    content:
      title: |
        Herzog Lab @ KCL
        **Epigenetics, Ageing & Stem Cells**
      text: |
        We study how the epigenome records biological experience, and how this memory can be harnessed to measure health and reshape stem cell fate across ageing and disease.
      # We study the epigenome as both a recorder of biological experience and a regulator of stem cell function across ageing and disease.
      primary_action:
        text: Our research
        url: '#epi-story'
        icon: hero/academic-cap
      secondary_action:
        text: Meet the team
        url: '#team'
        icon: hero/user-group
      # announcement:
      #   text: "We are hiring PhD students and postdocs!"
      #   link:
      #     text: "Apply now"
      #     url: "/opportunities"
    design:
      # For full-screen, add `min-h-screen` below
      css_class: ""
      background:
        # Option A: Modern gradient mesh (recommended for 2025/2026)
        gradient_mesh:
          enable: true
          style: "waves"
          animation: "pulse"
          intensity: "weak"
          colors:
            - "primary-500/30"
            - "secondary-500/35"
            - "tertiary-600/30"
        particles:
          enable: true

        # Option B: Team/lab image (uncomment to use instead of gradient mesh)
        # image:
        #   filename: "team-lab-hero.jpg"
        #   filters:
        #     brightness: 0.6
        #     contrast: 1.1

  - block: markdown
    id: epi-story
    content:
      title: ""
      text: |
        <section class="scroll-narrative" id="epi-narrative">
          <div class="stage">
            <div class="media-stage" id="global-media" aria-hidden="true">
              <div class="media" data-step="blank"></div>
              <div class="media" data-step="past"><img class="media-img" src="/media/story-past.png" alt="" loading="eager" decoding="async"></div>
              <div class="media" data-step="present"><img class="media-img" src="/media/story-present.png" alt="" loading="eager" decoding="async"></div>
              <div class="media" data-step="future"><img class="media-img" src="/media/story-future.png" alt="" loading="eager" decoding="async"></div>
              <div class="media" data-step="measure"><img class="media-img" src="/media/story-measure.png" alt="" loading="lazy" decoding="async"></div>
              <div class="media" data-step="modify"><img class="media-img" src="/media/story-modify.png" alt="" loading="lazy" decoding="async"></div>
            </div>
            <div class="story story-1">
              <h2 class="section-title">
                The <span class="brand">epigenome</span> integrates &amp; records
                <span class="word word-primary" data-step="past" style="--active: 71 89 165;">past</span>,
                <span class="word word-secondary" data-step="present" style="--active: 114 167 64;">present</span>,
                and <span class="word word-tertiary" data-step="future" style="--active: 170 106 131;">future</span>.
              </h2>
              <div class="details" aria-live="polite">
                <p class="detail" data-step="past">exposures, including smoking, viral infections, early-life adversity, pollution, and others.</p>
                <p class="detail" data-step="present">current cellular state and gene expression</p>
                <p class="detail" data-step="future">health trajectories and cell fate</p>
              </div>
            </div>
            <div class="story story-2">
              <h2 class="section-title">
                We use it to
                <span class="word word-secondary" data-step="measure" style="--active: 250 204 21;">measure</span>
                and
                <span class="word word-primary" data-step="modify" style="--active: 168 85 247;">modify</span>
                the ageing process.
              </h2>
              <div class="details" aria-live="polite">
                <p class="detail" data-step="measure"><strong>Measure:</strong> quantifiable markers of disease risk and ageing.</p>
                <p class="detail" data-step="modify"><strong>Modify:</strong> leverage epigenome to modulate health trajectories and cell fates.</p>
              </div>
            </div>
            <div class="flex justify-center mt-8">
            <a href="/#research-areas" id="scrollArrow" class="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 no-underline hover:no-underline">Find out more<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-bounce motion-reduce:animate-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" dtroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg></a>
            </div>
          </div>
          <div class="steps" aria-hidden="true">
            <div class="step" data-step="blank"></div>
            <div class="step" data-step="past"></div>
            <div class="step" data-step="present"></div>
            <div class="step" data-step="future"></div>
            <div class="step" data-step="section2"></div>
            <div class="step" data-step="measure"></div>
            <div class="step" data-step="modify"></div>
            <div class="step" data-step="end"></div>
          </div>
        </section>

  - block: research-areas
    id: research-areas
    content:
      title: Research areas
      subtitle: Unlocking the epigenetic code
      text: Our research investigates how the epigenome encodes biological experiences, how this encoding shapes stem cell function across tissues, and whether these mechanisms can be measured non-invasively and causally modulated to influence ageing and disease trajectories.
      items:
        - name: Epigenetic memory and cellular ageing
          description: Defining how DNA methylation encodes biological experience across tissues and stem cells.
          icon: hero/adjustments-horizontal-solid
          gradient: from-primary-200 to-primary-600
          status: active
          topics:
            - Epigenomics
            - Functional genomics
            - Bioinformatics
          # cta:
          #   text: Explore Projects
          #   url: /research/understand
            
        - name: Precision biomarkers of biological vulnerability
          description: Translating epigenetic memory into non-invasive biomarkers that capture vulnerability, resilience, and disease risk before clinical onset.
          icon: hero/finger-print-solid
          gradient: "from-[rgb(var(--hb-tertiary-600-rgb))] to-[rgb(var(--hb-tertiary-200-rgb))]"
          status: active
          topics:
            - Biomarker development
            - Translational research
          # cta:
          #   text: View Research
          #   url: /research/measure
            
        - name: Epigenetic regulation of stem cell function
          description: Using experimental systems to test whether epigenetic states causally influence stem cell behaviour and ageing.
          icon: hero/beaker
          gradient: from-secondary-200 to-secondary-600
          status: emerging
          topics:
            - Experimental models
            - Genome engineering
          # team_size: 1
          # publications: emerging
          # cta:
          #   text: Learn More
          #   url: /research/modify
      cta:
        text: More about our research
        url: /research
        icon: hero/arrow-right
    design:
      layout: cards
      css_class: "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      spacing:
        padding: ["5rem", 0, "5rem", 0]

  - block: pubs-embed
    id: publications
    content:
      title: Recent publications
      text: |
        Read recent publications co-authored by lab members
      bib: /bib/references.bib
      keys: "TGAtlas,BuccalBC,functageingsigs,LBARecs"
      archive:
        enable: true
        text: "See all publications"
        link: "/publications/"
        icon: hero/document-duplicate

  # - block: stats
  #   id: stats
  #   content:
  #     items:
  #       - statistic: "20+"
  #         description: Publications in top-tier journals
  #         sub_metric: Cell, Nature Medicine, Nature Aging
  #         icon: hero/document-text
  #       - statistic: "£2.8M+"
  #         description: Active research funding
  #         sub_metric: Wellcome Trust
  #         icon: hero/currency-pound
  #       - statistic: "3+"
  #         description: Active research projects
  #         sub_metric: Across 3 major domains
  #         icon: hero/beaker
  #   design:
  #     layout: cards
  #     # Section background color (CSS class)
  #     css_class: "bg-gradient-to-b from-white to-gray-50 dark:from-primary-900/20 dark:to-gray-800"
  #     spacing:
  #       padding: ["3rem", 0, "3rem", 0]

  # - block: collection
  #   id: featured
  #   content:
  #     title: Featured research
  #     filters:
  #       folders:
  #         - publications
  #       featured_only: true
  #   design:
  #     view: article-grid
  #     css_class: "grid-3"

  - block: team-showcase
    id: team
    content:
      title: Meet the team
      subtitle: 'Pushing the boundaries of geroscience'
      text: 'Our team of researchers brings together expertise from multiple disciplines to redefine how we leverage epigenetics in ageing research.'
      user_groups:
        - Principal Investigator
        - Postdoctoral Researchers
        - PhD Students
        - Students
        - Alumni
      sort_by: 'Params.last_name'
      sort_ascending: true
      cta:
        text: View all team members
        url: /authors
        icon: user-group
    design:
      show_role: false
      show_organizations: false
      show_interests: true
      show_social: true
      # Section background color
      css_class: "bg-gray-50 dark:bg-gray-900"
      # Reduce spacing
      spacing:
        padding: ["3rem", 0, "3rem", 0]

  - block: collection
    id: news
    content:
      title: Lab news & updates
      subtitle: ''
      text: ''
      # Page type to display. E.g. post, talk, publication...
      page_type: news
      # Choose how many pages you would like to display (0 = all pages)
      count: 3
      # Filter on criteria
      filters:
        author: ''
        category: ''
        tag: ''
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ''
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: news-oneline

  - block: collection
    id: events
    content:
      title: Upcoming events & outreach
      subtitle: Join us for research presentations & seminars
      text: Stay connected with our research through talks, workshops, and other events.
      filters:
        folders:
          - events
        exclude_past: true  # Show both past and future events
      count: 3
      sort_by: Date
      sort_ascending: true
    design:
      view: article-grid
      show_date: true
      show_read_time: false
      show_read_more: true
      css_class: "bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 grid-3"
      spacing:
        padding: ["4rem", 0, "4rem", 0]

  # - block: logos
  #   id: funding
  #   content:
  #     title: Funding
  #     subtitle: 
  #     text: We are grateful to our hosts, supporters, and funders.
  #     logos:
  #       - name: King's College London
  #         image: partners/kcl.png
  #         url: https://kcl.ac.uk
  #         external: true
  #         description: We are hosted by King's College London.
  #       - name: Wellcome Trust
  #         image: partners/wellcome.png
  #         url: https://wellcome.org/
  #         external: true
  #         description: We are funded by the Wellcome Trust.
  #     cta:
  #       text: Become a Partner
  #       url: /#contact
  #       icon: hero/user-plus
  #   design:
  #     display_mode: grid
  #     show_pattern: false
  #     css_class: "funding-logos bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
  #     spacing:
  #       padding: ["4rem", 0, "4rem", 0]

  - block: contact-info
    id: contact
    content:
      title: Contact Us
      subtitle: 
      visit_title: Location
      connect_title: Connect with us
      address:
        lines:
          - Department of Twin Research & Genetic Epidemiology
          - St. Thomas' Hospital
          - Westminster Bridge Road
          - SE1 7EH
          - London
          - United Kingdom
      email: chiara.herzog@kcl.ac.uk
      social:
        - icon: brands/github
          url: https://github.com/chiaraherzog
        - icon: brands/linkedin
          url: https://www.linkedin.com/in/chiara-herzog/
      prospective:
        title: Prospective Members
        text: Interested in joining our lab?
        button:
          text: View opportunities
          url: /opportunities
      map_url: https://maps.google.com/?q=University+of+Excellence
      show_form: false
    design:
      css_class: "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      spacing:
        padding: ["5rem", 0, "5rem", 0]

  # - block: cta-card
  #   id: join
  #   content:
  #     title: Join our research team
  #     text: We are always looking for talented and motivated researchers to join our lab. We have openings for PhD students, postdoctoral researchers, and research scientists.
  #     button:
  #       text: View Open Positions
  #       url: /opportunities
  #   design:
  #     card:
  #       # Card background color (CSS class)
  #       css_class: 'bg-primary-300 dark:bg-primary-700'
  #       css_style: ''

params:
  lab_footer:
    columns:
      - title: "Affiliations & support"
        type: "logos"
        items:
          - name: "Supported by the King's Prize Fellowship & Prof. Mellows Medal."
            url: "https://www.kcl.ac.uk/"
            logo: "/media/kcl.png"
          # - name: "Funded by the Wellcome Trust"
          #   url: "https://wellcome.org/"
          #   logo: "/media/wellcome.png"

      - title: "Links"
        type: "links"
        items:
          - text: "Contact"
            url: "/#contact"
            icon: "fa-envelope"
          - text: "Team"
            url: "/#team"
            icon: "fa-users"
          - text: "Research"
            url: "/research"
            icon: "fa-flask"
          - text: "Publications"
            url: "/publications/"
            icon: "fa-file-lines"
          - text: "Join"
            url: "/opportunities/"
            icon: "fa-user-plus"
          - text: "Back to top"
            url: "#top"
            icon: "fa-arrow-up"
---