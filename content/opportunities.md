---
title: Join Our Team
date: 2024-01-01
type: landing

sections:
  - block: hero
    content:
      title: |
        Join the team
      text: |
        Our lab offers a collaborative and innovative research environment where you can work on cutting-edge problems at the intersection of computational and experimental biology. We value diversity, creativity, and scientific rigor.
      primary_action:
        text: Our ethos
        url: '#whyjoin'
        icon: hero/user
      secondary_action:
        text: Expressions of interest
        url: '#eoi'
        icon: hero/document-text
      # announcement:
      #   text: "We are hiring PhD students and postdocs!"
      #   link:
      #     text: "Apply now"
      #     url: "#openroles"
    design:
      css_class: ""
      background:
        gradient_mesh:
          enable: true
          style: "orbs"
          animation: "pulse"
          intensity: "medium"
          colors:
            - "blue-600/25"
            - "indigo-600/20"
            - "purple-600/15"


  - block: markdown
    id: whyjoin
    content:
      title: 'Why join the lab?'
      text: | 
        Our lab is built around the ethos that excellent research and a healthy lab culture go hand in hand. We believe the **best science is done by people who can be themselves, enjoy what they do, feel valued for their contributions, and have the opportunity to grow**. We therefore emphasize openness, creativity, and kindness.
        
        Lab members benefit from close integration within King's College London, with research spanning experimental work, population studies, and clinical cohorts, alongside active collaborations across the UK, Europe, and the US. You will have opportunities to work across methods and disciplines, access rich datasets and resources, and have access to exciting collaborations and networks.

        If you're excited by ambitious questions about why we age and how we might engineer the cell's software, and are motivated to grow as an independent scientist, our lab could be a great fit for you. 
    design:
      columns: 2

  - block: collection
    id: openroles
    content:
      title: Open roles
      subtitle: ''
      text: |
        We will be advertising positions shortly. Please check back soon.
      filters:
        folders:
          - position
      count: 0
    design:
      view: article-grid
      columns: 2
      show_author: false
      show_read_time: false
      show_date: true
      show_tags: true
      css_class: "bg-gray-50 dark:bg-gray-900"

  - block: cta-card
    id: eoi
    content:
      title: Expressions of interest
      text: |
        *Not seeing a suitable role listed above?*
        
        We are keen to hear from motivated and collaborative researchers who are excited by our work, rigorous science, and big questions. If you think your interests and expertise could be a good fit for the lab, please submit an expression of interest below.

      button:
        text: Take me to the form
        url: '#eoi-form'
    design:
      card:
        css_class: 'bg-primary-300 dark:bg-primary-800'

  - block: markdown
    id: eoi-form
    content:
      title: 
      text: |
        <div class="not-prose"
            style="width: 100vw; margin-left: calc(50% - 50vw);">
          <div class="mx-auto max-w-6xl px-6 md:px-12">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeqs0u-nXrVAJgNJx4fqpa56UcTw5UaF_GaR9jvyyL5MXiIJQ/viewform?usp=header"
              style="width:100%;  height:2600px;"
              class=""
              frameborder="0"
              marginheight="0"
              marginwidth="0">
              Loading…
            </iframe>
          </div>
        </div>

---
