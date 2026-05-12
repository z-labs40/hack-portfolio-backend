import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.units import inch

def generate_pdf(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Title'],
        fontSize=32,
        textColor=colors.HexColor("#2563EB"), # Modern Blue
        spaceAfter=30,
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Normal'],
        fontSize=18,
        textColor=colors.gray,
        spaceAfter=50,
        alignment=1
    )
    
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=20,
        spaceAfter=12
    )
    
    subheading_style = ParagraphStyle(
        'SubheadingStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor("#475569"),
        spaceBefore=15,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        spaceAfter=10
    )

    story = []

    # --- Title Page ---
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("HACKFOLIO", title_style))
    story.append(Paragraph("Comprehensive User Manual & Workflow Document", subtitle_style))
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("<b>Version:</b> 1.0.0", body_style))
    story.append(Paragraph("<b>Date:</b> May 12, 2026", body_style))
    story.append(Paragraph("<b>Status:</b> Official Documentation", body_style))
    story.append(PageBreak())

    # --- Executive Summary ---
    story.append(Paragraph("Executive Summary", heading_style))
    story.append(Paragraph(
        "Hackfolio is a state-of-the-art platform designed for developers and hackers to showcase their projects "
        "and hackathon entries in a visually stunning and organized manner. By providing a drag-and-drop portfolio builder, "
        "Hackfolio simplifies the process of creating professional-grade project showcases without requiring deep frontend "
        "expertise for every individual project.",
        body_style
    ))
    story.append(Spacer(1, 0.2*inch))

    # --- User Manual ---
    story.append(Paragraph("1. User Manual", heading_style))
    
    story.append(Paragraph("1.1 Authentication", subheading_style))
    story.append(Paragraph(
        "Users can register and log in to Hackfolio using their email and password. Secure JWT-based authentication "
        "ensures that user data and projects remain private and protected.",
        body_style
    ))

    story.append(Paragraph("1.2 Dashboard", subheading_style))
    story.append(Paragraph(
        "The Dashboard is the central hub where users can view all their projects, monitor their performance (view counts), "
        "and initiate the creation of new portfolios.",
        body_style
    ))

    story.append(Paragraph("1.3 Portfolio Builder", subheading_style))
    story.append(Paragraph(
        "The Builder provides a dynamic workspace where users can add sections, customize text, and upload images. "
        "Key features include:",
        body_style
    ))
    story.append(Paragraph("- <b>Drag-and-Drop:</b> Reorder sections with ease.", body_style))
    story.append(Paragraph("- <b>Real-time Preview:</b> See changes as you make them.", body_style))
    story.append(Paragraph("- <b>Rich Content:</b> Add taglines, project descriptions, and technical stacks.", body_style))

    story.append(Paragraph("1.4 Publishing", subheading_style))
    story.append(Paragraph(
        "Once a portfolio is ready, users can publish it to generate a unique public URL (slug). These public pages "
        "are optimized for speed and SEO, making them perfect for sharing with recruiters or on social media.",
        body_style
    ))

    story.append(PageBreak())

    # --- Technical Workflow ---
    story.append(Paragraph("2. Technical Workflow", heading_style))
    
    story.append(Paragraph("2.1 System Architecture", subheading_style))
    story.append(Paragraph(
        "The system follows a modern decoupled architecture consisting of a robust backend API and a high-performance frontend application.",
        body_style
    ))

    # Architecture Table
    data = [
        ['Component', 'Technology Stack', 'Responsibility'],
        ['Frontend', 'React, Tailwind, Zustand', 'User Interface, Builder Logic, Routing'],
        ['Backend', 'Node.js, Express, TypeScript', 'API, Business Logic, Security'],
        ['Database', 'Supabase (PostgreSQL)', 'Data Persistence, Storage'],
        ['Auth', 'JWT / Supabase Auth', 'User Security & Session Management']
    ]
    t = Table(data, colWidths=[1.2*inch, 2*inch, 3*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.2*inch))

    story.append(Paragraph("2.2 Data Flow", subheading_style))
    story.append(Paragraph(
        "The application follows a strict data flow pattern to ensure maintainability:",
        body_style
    ))
    story.append(Paragraph("1. <b>Client Request:</b> The React frontend makes an authenticated request via Axios/React Query.", body_style))
    story.append(Paragraph("2. <b>Route Handler:</b> Backend Express routes capture the request and pass it to controllers.", body_style))
    story.append(Paragraph("3. <b>Use Case:</b> Controllers invoke specific business logic (Use Cases) that implement project requirements.", body_style))
    story.append(Paragraph("4. <b>Infrastructure:</b> Repositories interact with Supabase to fetch or persist data.", body_style))

    story.append(Paragraph("2.3 API Endpoints", subheading_style))
    api_data = [
        ['Method', 'Endpoint', 'Description'],
        ['POST', '/api/auth/signup', 'Register a new user'],
        ['POST', '/api/auth/login', 'Authenticate user'],
        ['GET', '/api/projects', 'Fetch user projects'],
        ['POST', '/api/projects', 'Create new project'],
        ['GET', '/api/p/:slug', 'Public project view'],
        ['POST', '/api/upload', 'Asset management']
    ]
    at = Table(api_data, colWidths=[1*inch, 2*inch, 3*inch])
    at.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(at)

    story.append(PageBreak())

    # --- Setup & Installation ---
    story.append(Paragraph("3. Setup & Installation", heading_style))
    
    story.append(Paragraph("3.1 Prerequisites", subheading_style))
    story.append(Paragraph("- Node.js (v18 or higher)", body_style))
    story.append(Paragraph("- PNPM (recommended package manager)", body_style))
    story.append(Paragraph("- Supabase Account & Project", body_style))

    story.append(Paragraph("3.2 Environment Configuration", subheading_style))
    story.append(Paragraph(
        "Both backend and frontend require .env files containing API keys, database URLs, and port configurations. "
        "Refer to .env.example files in respective directories for details.",
        body_style
    ))

    story.append(Paragraph("3.3 Running Locally", subheading_style))
    story.append(Paragraph("<b>Backend:</b> <code>npm run dev</code>", body_style))
    story.append(Paragraph("<b>Frontend:</b> <code>npm run start</code>", body_style))

    # Build the document
    doc.build(story)
    print(f"Successfully generated documentation at: {output_path}")

if __name__ == "__main__":
    output_file = "Hackfolio_Documentation.pdf"
    generate_pdf(output_file)
