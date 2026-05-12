import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import inch

def get_custom_styles():
    styles = getSampleStyleSheet()
    custom_styles = {
        'Title': ParagraphStyle(
            'TitleStyle', parent=styles['Title'], fontSize=32, textColor=colors.HexColor("#2563EB"), spaceAfter=30, alignment=1
        ),
        'Subtitle': ParagraphStyle(
            'SubtitleStyle', parent=styles['Normal'], fontSize=18, textColor=colors.gray, spaceAfter=50, alignment=1
        ),
        'Heading': ParagraphStyle(
            'HeadingStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor("#1E293B"), spaceBefore=20, spaceAfter=12
        ),
        'Subheading': ParagraphStyle(
            'SubheadingStyle', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor("#475569"), spaceBefore=15, spaceAfter=10
        ),
        'Body': ParagraphStyle(
            'BodyStyle', parent=styles['Normal'], fontSize=11, leading=16, spaceAfter=10
        ),
        'Code': ParagraphStyle(
            'CodeStyle', parent=styles['Normal'], fontSize=10, fontName='Courier', textColor=colors.HexColor("#1E293B"),
            backgroundColor=colors.HexColor("#F1F5F9"), leftIndent=20, rightIndent=20, spaceBefore=10, spaceAfter=10,
            borderPadding=5, borderRadius=3, leading=14
        )
    }
    return custom_styles

def generate_user_manual(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = get_custom_styles()
    story = []

    # Title Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("HACKFOLIO", styles['Title']))
    story.append(Paragraph("User Manual", styles['Subtitle']))
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("<b>Version:</b> 1.0.0", styles['Body']))
    story.append(Paragraph("<b>Date:</b> May 12, 2026", styles['Body']))
    story.append(PageBreak())

    # Content
    story.append(Paragraph("1. Introduction", styles['Heading']))
    story.append(Paragraph("Welcome to Hackfolio, the ultimate platform for developers to showcase their hackathon projects and personal portfolios with professional aesthetics.", styles['Body']))

    story.append(Paragraph("2. Getting Started", styles['Heading']))
    story.append(Paragraph("2.1 Creating an Account", styles['Subheading']))
    story.append(Paragraph("Navigate to the Signup page, enter your details, and create your account. We use secure authentication to keep your project data safe.", styles['Body']))

    story.append(Paragraph("2.2 Dashboard Overview", styles['Subheading']))
    story.append(Paragraph("After logging in, you will land on the Dashboard. Here you can see all your existing projects, their view counts, and a button to create a new project.", styles['Body']))

    story.append(Paragraph("3. Building a Portfolio", styles['Heading']))
    story.append(Paragraph("3.1 Using the Builder", styles['Subheading']))
    story.append(Paragraph("The Hackfolio Builder features an intuitive drag-and-drop interface. You can add sections like 'About Me', 'Project Details', 'Tech Stack', and 'Contact Information'.", styles['Body']))
    story.append(Paragraph("- <b>Customizing Text:</b> Click on any text block to edit its content.", styles['Body']))
    story.append(Paragraph("- <b>Reordering:</b> Use the drag handles to move sections up or down.", styles['Body']))

    story.append(Paragraph("3.2 Saving & Publishing", styles['Subheading']))
    story.append(Paragraph("Once you are satisfied with your layout, hit the 'Save' button. When you are ready for the world to see it, click 'Publish' to generate your public link.", styles['Body']))

    story.append(Paragraph("4. Managing Projects", styles['Heading']))
    story.append(Paragraph("You can edit your projects at any time from the Dashboard. If a project is no longer needed, you can delete it permanently.", styles['Body']))

    doc.build(story)
    print(f"Generated User Manual: {output_path}")

def generate_workflow_doc(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = get_custom_styles()
    story = []

    # Title Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("HACKFOLIO", styles['Title']))
    story.append(Paragraph("Workflow & Technical Documentation", styles['Subtitle']))
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("<b>Version:</b> 1.0.0", styles['Body']))
    story.append(Paragraph("<b>Environment:</b> PNPM Workspaces (Logical)", styles['Body']))
    story.append(PageBreak())

    # Content
    story.append(Paragraph("1. Technical Overview", styles['Heading']))
    story.append(Paragraph("Hackfolio is built using a modern Full-Stack TypeScript architecture, leveraging Supabase for data and authentication.", styles['Body']))

    story.append(Paragraph("2. Package Management (PNPM)", styles['Heading']))
    story.append(Paragraph("The project uses <b>PNPM</b> for fast, disk-efficient package management. Both the frontend and backend are managed as independent modules but can be run concurrently.", styles['Body']))
    story.append(Paragraph("<b>Standard Commands:</b>", styles['Subheading']))
    story.append(Paragraph("Install Dependencies:", styles['Body']))
    story.append(Paragraph("pnpm install", styles['Code']))
    story.append(Paragraph("Run Backend Dev Server:", styles['Body']))
    story.append(Paragraph("pnpm dev", styles['Code']))
    story.append(Paragraph("Run Frontend Dev Server:", styles['Body']))
    story.append(Paragraph("pnpm start", styles['Code']))

    story.append(Paragraph("3. How It Works (Detailed Flow)", styles['Heading']))
    story.append(Paragraph("3.1 Frontend Architecture", styles['Subheading']))
    story.append(Paragraph("The frontend is a React application built with Craco. It uses <b>Zustand</b> for lightweight global state management (specifically for the builder's state) and <b>React Query</b> for server state synchronization.", styles['Body']))
    
    story.append(Paragraph("3.2 Backend Architecture", styles['Subheading']))
    story.append(Paragraph("The backend follows <b>Clean Architecture</b> principles, separating business logic from infrastructure. Layers include:", styles['Body']))
    story.append(Paragraph("- <b>Adapters:</b> Controllers that handle incoming HTTP requests.", styles['Body']))
    story.append(Paragraph("- <b>Application:</b> Use Cases that define what the system does (e.g., CreateProject).", styles['Body']))
    story.append(Paragraph("- <b>Infrastructure:</b> Implementation of repositories using Supabase/TypeORM.", styles['Body']))

    story.append(Paragraph("3.3 Data Flow", styles['Subheading']))
    data_flow = [
        ['Step', 'Action', 'Entity'],
        ['1', 'User creates layout in Builder', 'Frontend (Zustand)'],
        ['2', 'User clicks Save/Publish', 'Frontend (Axios/React Query)'],
        ['3', 'Request reaches Express API', 'Backend (Controller)'],
        ['4', 'Business logic executed', 'Backend (Use Case)'],
        ['5', 'Data persisted in Postgres', 'Infrastructure (Supabase)'],
        ['6', 'Public URL available for access', 'Public Route']
    ]
    t = Table(data_flow, colWidths=[0.5*inch, 3*inch, 2.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t)

    story.append(Paragraph("4. System Infrastructure", styles['Heading']))
    story.append(Paragraph("- <b>Database:</b> PostgreSQL (via Supabase).", styles['Body']))
    story.append(Paragraph("- <b>Storage:</b> Supabase Storage for project assets/images.", styles['Body']))
    story.append(Paragraph("- <b>Auth:</b> JWT-based authentication integrated with Supabase Auth.", styles['Body']))

    doc.build(story)
    print(f"Generated Workflow Doc: {output_path}")

if __name__ == "__main__":
    generate_user_manual("Hackfolio_User_Manual.pdf")
    generate_workflow_doc("Hackfolio_Workflow_Documentation.pdf")
