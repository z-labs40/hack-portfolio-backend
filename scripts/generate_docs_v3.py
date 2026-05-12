import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
from reportlab.lib.units import inch

def get_custom_styles():
    styles = getSampleStyleSheet()
    custom_styles = {
        'MainTitle': ParagraphStyle(
            'MainTitle', parent=styles['Title'], fontSize=24, textColor=colors.black, spaceAfter=10, alignment=1, fontName='Helvetica-Bold'
        ),
        'SubHeader': ParagraphStyle(
            'SubHeader', parent=styles['Normal'], fontSize=12, textColor=colors.black, spaceAfter=20, alignment=1, fontName='Helvetica-Bold'
        ),
        'SectionHeading': ParagraphStyle(
            'SectionHeading', parent=styles['Heading1'], fontSize=14, textColor=colors.black, spaceBefore=15, spaceAfter=10, fontName='Helvetica-Bold'
        ),
        'Body': ParagraphStyle(
            'Body', parent=styles['Normal'], fontSize=11, leading=14, spaceAfter=8, fontName='Helvetica'
        ),
        'BoldBody': ParagraphStyle(
            'BoldBody', parent=styles['Normal'], fontSize=11, leading=14, spaceAfter=8, fontName='Helvetica-Bold'
        ),
        'ListItem': ParagraphStyle(
            'ListItem', parent=styles['Normal'], fontSize=11, leading=14, leftIndent=20, spaceAfter=5, fontName='Helvetica'
        )
    }
    return custom_styles

def generate_user_manual(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = get_custom_styles()
    story = []

    # Header Section
    story.append(Paragraph("Hackfolio - User Manual", styles['MainTitle']))
    story.append(Paragraph("System Role: Professional Portfolio & Project Showcase Management", styles['SubHeader']))
    story.append(Paragraph("Target Audience: Developers, Recruiters, and Administrators", styles['SubHeader']))
    story.append(Spacer(1, 0.2*inch))

    # 1. Introduction
    story.append(Paragraph("1. Introduction", styles['SectionHeading']))
    story.append(Paragraph(
        "This user manual provides a comprehensive, step-by-step guide for navigating and utilizing the Hackfolio System. "
        "Designed to eliminate the delays of static PDF resumes and manual website building, this digital platform ensures "
        "your professional showcase is always up-to-date and visually stunning. The guide is divided into specific sections "
        "based on your assigned user role.",
        styles['Body']
    ))

    # 2. Getting Started
    story.append(Paragraph("2. Getting Started (Authentication)", styles['SectionHeading']))
    story.append(Paragraph("• <b>Accessing the Portal:</b> Open your web browser and navigate to the designated Hackfolio URL.", styles['ListItem']))
    story.append(Paragraph("• <b>Logging In:</b> Enter your registered email address and password.", styles['ListItem']))
    story.append(Paragraph("• <b>Password Recovery:</b> If you forget your password, click the Forgot Password link to receive a secure One-Time Password (OTP) via email to reset your credentials.", styles['ListItem']))

    # 3. Viewer Portal Guide
    story.append(Paragraph("3. Viewer Portal Guide", styles['SectionHeading']))
    story.append(Paragraph(
        "The Viewer Portal is optimized for recruiters and collaborators to quickly locate and explore professional project showcases.",
        styles['Body']
    ))
    story.append(Paragraph("• <b>The Portfolio Feed:</b> Upon access, the public dashboard displays a grid of featured portfolios and recent projects.", styles['ListItem']))
    story.append(Paragraph("• <b>Viewing Details:</b> Click on any portfolio card to expand the view and explore project descriptions, technical stacks, and live links.", styles['ListItem']))
    story.append(Paragraph("• <b>Downloading Assets:</b> If the builder has attached a resume or project documentation, a Download button will be visible. Clicking this securely downloads the file from the cloud directly to your device.", styles['ListItem']))

    # 4. Builder Interface Guide
    story.append(Paragraph("4. Builder Interface Guide", styles['SectionHeading']))
    story.append(Paragraph(
        "The Builder Interface grants developers the ability to securely create and distribute their professional portfolios.",
        styles['Body']
    ))
    story.append(Paragraph("• <b>Creating a Portfolio:</b> Navigate to the Dashboard and click 'Create New' to start your journey.", styles['ListItem']))
    story.append(Paragraph("• <b>Drag-and-Drop Customization:</b> Use the intuitive builder to add sections (e.g., Projects, Skills, About). Reorder them using the drag handles to match your preferred layout.", styles['ListItem']))
    story.append(Paragraph("• <b>Content Formatting:</b> Enter a clear Title and Tagline. Provide full details in the description boxes using the rich text editor.", styles['ListItem']))
    story.append(Paragraph("• <b>Uploading Media:</b> Use the file uploader to attach project images or PDF resumes. The system automatically handles secure cloud storage via Supabase S3.", styles['ListItem']))
    story.append(Paragraph("• <b>Publishing:</b> After reviewing your content, click Publish. The system will immediately generate a unique public slug and make your portfolio live.", styles['ListItem']))

    # 5. Administrator Guide
    story.append(Paragraph("5. Administrator Guide", styles['SectionHeading']))
    story.append(Paragraph(
        "The Administrator Dashboard is the central control hub, providing absolute oversight over system operations, users, and content.",
        styles['Body']
    ))
    story.append(Paragraph("• <b>User Management:</b> Admins can add new users, update profiles, or deactivate accounts. This interface is also used to assign specific roles.", styles['ListItem']))
    story.append(Paragraph("• <b>Content Moderation:</b> Admins possess global authority to unpublish, edit, or delete any portfolio if it violates platform policies.", styles['ListItem']))
    story.append(Paragraph("• <b>Audit Logging:</b> To maintain security, admins can review system activity logs to trace exactly who modified content and when.", styles['ListItem']))

    doc.build(story)
    print(f"Generated User Manual: {output_path}")

def generate_workflow_doc(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = get_custom_styles()
    story = []

    # Header Section
    story.append(Paragraph("Hackfolio - Workflow Manual", styles['MainTitle']))
    story.append(Paragraph("Project Category: Professional Portfolio Management (Full-Stack)", styles['SubHeader']))
    story.append(Paragraph("Environment: Professional Web Infrastructure", styles['SubHeader']))
    story.append(Spacer(1, 0.2*inch))

    # Overview
    story.append(Paragraph("Project Overview and Strategic Objectives", styles['SectionHeading']))
    story.append(Paragraph(
        "The Hackfolio System is a specialized web application designed to digitize and streamline the dissemination of professional "
        "achievements. The primary objective is to eliminate the inefficiencies associated with static portfolios, such as "
        "outdated information and lack of engagement tracking. By implementing real-time builder controls, secure asset hosting, "
        "and professional aesthetics, the system ensures a modern ecosystem for developer branding.",
        styles['Body']
    ))

    # Architecture
    story.append(Paragraph("Advanced Technical Architecture and Design Patterns", styles['SectionHeading']))
    story.append(Paragraph(
        "The backend of this project is engineered using <b>Clean Architecture</b> principles, effectively decoupling core business logic "
        "from external infrastructure. This ensures the codebase remains scalable and maintainable.",
        styles['Body']
    ))
    story.append(Paragraph("• <b>Frontend Framework:</b> Developed using React to provide a highly responsive user interface with dynamic state updates.", styles['ListItem']))
    story.append(Paragraph("• <b>Backend Runtime:</b> Powered by Node.js and TypeScript to handle secure API communication and business logic execution.", styles['ListItem']))
    story.append(Paragraph("• <b>Database Infrastructure:</b> Utilizes PostgreSQL (Supabase) for robust data persistence and secure user sessions.", styles['ListItem']))
    story.append(Paragraph("• <b>Cloud Storage Strategy:</b> Utilizes Supabase S3 storage for secure hosting of project attachments, eliminating local dependencies.", styles['ListItem']))

    # Access Control
    story.append(Paragraph("Multitiered User Roles and Access Control", styles['SectionHeading']))
    story.append(Paragraph("<b>Viewer Portal:</b> Users browse real-time portfolios and projects. They can securely download attached documents like resumes.", styles['Body']))
    story.append(Paragraph("<b>Builder Interface:</b> Dedicated to developers to create, edit, and publish their personal showcases with targeted content.", styles['Body']))
    story.append(Paragraph("<b>Admin Dashboard:</b> The central control hub for managing user roles, overseeing global content, and enforcing system policies.", styles['Body']))

    # Workflow
    story.append(Paragraph("Operational Workflow and Accountability Framework", styles['SectionHeading']))
    story.append(Paragraph("<b>Secure Publishing:</b> Portfolios are created with unique slugs. Attachments are securely uploaded to Supabase S3, guaranteeing file accessibility.", styles['Body']))
    story.append(Paragraph("<b>Automated Notifications:</b> (Optional) Integration for email alerts when portfolios receive significant updates or engagement.", styles['Body']))
    story.append(Paragraph("<b>System Transparency (Audit Trail):</b> Activity Logs monitor every action taken by builders and admins, fostering trust and security.", styles['Body']))

    # Download
    story.append(Paragraph("Download and Attachment Access", styles['SectionHeading']))
    story.append(Paragraph("• <b>Finding Files:</b> Open any portfolio. If an attachment exists, a Download action is displayed.", styles['ListItem']))
    story.append(Paragraph("• <b>Download Process:</b> Click to fetch the file from secure cloud storage directly to your device.", styles['ListItem']))
    story.append(Paragraph("• <b>Supported Formats:</b> PDF resumes, image galleries, and project assets.", styles['ListItem']))

    # Conclusion
    story.append(Paragraph("Project Impact and Conclusion", styles['SectionHeading']))
    story.append(Paragraph(
        "By replacing outdated static resumes, this system accelerates professional discovery and ensures that developers "
        "can showcase their skills instantly. Ultimately, Hackfolio provides a modern, convenient, and professional "
        "ecosystem for managing personal branding infrastructure.",
        styles['Body']
    ))

    doc.build(story)
    print(f"Generated Workflow Doc: {output_path}")

if __name__ == "__main__":
    generate_user_manual("Hackfolio_User_Manual.pdf")
    generate_workflow_doc("Hackfolio_Workflow_Documentation.pdf")
