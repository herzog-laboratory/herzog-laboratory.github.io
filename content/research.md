---
title: Research
date: 2026-02-12
type: landing

design:
  # Default section spacing
  spacing: '4rem'

sections:
  - block: hero
    content:
      title: |
        Research
      text: |
        &nbsp;
      # primary_action:
      #   text: Our ethos
      #   url: '#whyjoin'
      #   icon: hero/user
      # secondary_action:
      #   text: Expressions of interest
      #   url: '#eoi'
      #   icon: hero/document-text
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
          style: "grid"
          # animation: "pulse"
          # intensity: "medium"
          colors:
            - "blue-600/25"
            - "indigo-600/20"
            - "purple-600/15"
        # particles:
        #   enable: true

  - block: cta-image-paragraph
    content:
      items:
        - title: 'Age-related disease risk arises from the dynamic interplay between genetic background, cellular identity, and accumulated biological experience.'
          text: |
            The <a href="/#epi-story">epigenome</a> records these interactions, integrating genetic variation, environmental exposures, and cellular context into stable yet dynamic molecular patterns. At the same time, epigenetic states help shape cell fate and tissue function, positioning the epigenome as both a molecular archive of biological experience and a potential regulator of disease risk. Our work investigates how DNA methylation encodes these signals across tissues and stem cell systems, and how this information can be harnessed to understand age-related disease formation, improve non-invasive risk prediction, and actively modulate stem cell function.
          image: outline-wide2.png
          feature_icon: hero/arrow-right
          features:
            - 'How are genetic background, cell type, and exposures integrated and recorded in epigenetic ‘footprints’ that either directly predispose to, or are associated with, certain diseases?'
            - 'Can molecular ‘footprints’, in particular DNA methylation (DNAme) in non-invasively collected samples, detect current or future disease in other tissues of the same individual?'  
            - 'Do different tissues within an individual age at different rates, and how is this associated with disease risk?'
            - 'What are the functional consequences of epigenetic alterations across diverse cell types, and how do they contribute to disease formation?'
          # button:
          #   text: 'Request Computing Access'
          #   url: '/resources/computing'

  - block: research-areas
    id: research-areas
    content:
      title: Core themes
      subtitle:
      text:
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
          cta:
            text: Learn more
            url: /research/#understand
            
        - name: Precision biomarkers of biological vulnerability
          description: Translating epigenetic memory into non-invasive biomarkers that capture vulnerability, resilience, and disease risk before clinical onset.
          icon: hero/finger-print-solid
          gradient: "from-[rgb(var(--hb-tertiary-600-rgb))] to-[rgb(var(--hb-tertiary-200-rgb))]"
          status: active
          topics:
            - Biomarker development
            - Translational research
          cta:
            text: Learn more
            url: /research/#measure
            
        - name: Epigenetic regulation of stem cell function
          description: Using experimental systems to test whether epigenetic states causally influence stem cell behaviour and ageing.
          icon: hero/beaker
          gradient: from-secondary-200 to-secondary-600
          status: emerging
          topics:
            - Experimental models
            - Genome engineering
          cta:
            text: Learn more
            url: /research/#modify
      # cta:
      #   text: More about our research
      #   url: /research
      #   icon: hero/arrow-right

  - block: markdown
    id: understand
    content:
      title: Epigenetic memory and cellular ageing
      text: |
        Ageing and disease risk emerge from the accumulation of biological experience across diverse cell types and tissues. DNA methylation provides a molecular layer through which genetic background, environmental exposures, and cellular identity are integrated into relatively stable yet dynamic epigenetic patterns. These patterns can differ markedly between organs and even between stem cell compartments within the same individual. 
        
        Our work investigates how such epigenetic "memory" is established, maintained, and remodelled across the lifespan. By combining large-scale epigenomic profiling with systems-level analysis, we aim to define how ageing arises unevenly across tissues, why certain cell populations appear more vulnerable than others, and how epigenetic states reflect underlying biological processes.

        ## Key questions

        - How are genetic variation, environmental exposures, and cellular identity integrated into DNA methylation patterns across tissues?
        - Why do different organs and stem cell systems age at different rates within the same individual?
        - How stable are epigenetic signatures over time, and when do they reflect adaptive versus maladaptive responses?
        - Which epigenetic features represent long-term biological memory versus transient cellular state?

        ## Selected publications
        Relevant publications co-authored by lab members
        {{< pubs key="canresvaping" >}}
        {{< pubs key="functageingsigs" >}}
        {{< pubs key="MouseMife" >}}
        {{< pubs key="widrea" >}}
    design:
      columns: '1'
      css_class: "bg-gradient-to-b text-sm from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"

  - block: markdown
    id: measure
    content:
      title: 'Precision biomarkers of biological vulnerability'
      text: |
        If the epigenome records biological experience, can this molecular memory be translated into actionable clinical insight? DNA methylation profiles captured in non-invasive samples offer a unique opportunity to quantify biological ageing, system-specific vulnerability, and future disease risk before overt clinical manifestation.
        
        Our research develops and rigorously evaluates epigenetic biomarkers that capture tissue-specific risk and resilience. Integrating high-dimensional molecular data with clinical and longitudinal health records, we aim to determine when DNA methylation-based predictors generalise across populations and when they reveal context-specific vulnerabilities.

        ## Key questions
        - Which sample types and molecular features provide the most informative signals of system-specific ageing and disease risk?
        - Can DNA methylation patterns in accessible tissues detect pathological processes occurring elsewhere in the body?
        - How early can epigenetic biomarkers identify elevated risk for complex diseases?
        - Do molecular risk predictors generalise across diverse populations and exposure contexts?
        
        ## Select publications
        Relevant publications co-authored by lab members
        {{< pubs key="BuccalBC" >}}
        {{< pubs key="TGAtlas" >}}
        {{< pubs key="TGIF" >}}
        {{< pubs key="TGSMK" >}}
    design:
      columns: '1'
      css_class: "bg-primary-50 dark:bg-primary-900/10"

  - block: markdown
    id: modify
    content:
      title: Epigenetic regulation of stem cell function
      text: |
        Beyond recording biological experience, epigenetic states help shape cell identity, lineage commitment, and regenerative capacity. Ageing is accompanied by progressive shifts in these regulatory landscapes, particularly within stem cell compartments that maintain tissue homeostasis. 
        
        Our work explores when epigenetic alterations are passive reflections of ageing and when they actively constrain stem cell function. By integrating computational modelling with experimental systems, we investigate whether defined epigenetic states influence cellular trajectories and whether targeted modulation of these states can redirect ageing-associated functional decline. This theme bridges molecular measurement with mechanistic interrogation, asking not only what epigenetic patterns signify, but what they do.

        ## Key questions
        - Do age-associated epigenetic changes directly alter stem cell identity or regenerative potential?
        - Under what conditions do epigenetic states constrain or redirect cellular trajectories?
        - How reversible are ageing-associated epigenetic alterations?
        - Can defined epigenetic configurations promote resilience in ageing tissues?

    design:
      css_class: "dark bg-gray-900 text-white"

  # - block: collection
  #   id: projects
  #   content:
  #     title: Active research projects
  #     subtitle: ''
  #     text: |
  #       We are currently expanding our website and will feature ongoing projects soon.
  #     filters:
  #       folders:
  #         - projects_x
  #     count: 0
  #   design:
  #     view: article-grid
  #     columns: 2
  #     show_author: false
  #     show_read_time: false
  #     show_date: true
  #     show_tags: true
  #     css_class: "bg-gray-50 dark:bg-gray-900"

---
