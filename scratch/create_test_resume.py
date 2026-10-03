import os

def create_simple_pdf(filepath, name, title, skills, experience):
    """
    Generates a valid, parseable minimalist PDF file containing text.
    """
    content = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kinds [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 250 >>
stream
BT
/F1 12 Tf
50 750 Td
({name} - {title}) Tj
0 -20 Td
(Skills: {skills}) Tj
0 -20 Td
(Experience: {experience}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
0000000283 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
385
%%EOF
"""
    with open(filepath, 'wb') as f:
        f.write(content.encode('latin-1'))

if __name__ == "__main__":
    os.makedirs("scratch/resumes", exist_ok=True)
    pdf_path = "scratch/resumes/john_doe_resume.pdf"
    create_simple_pdf(
        pdf_path,
        "John Doe",
        "Senior Software Engineer",
        "Python, React, Node.js, FastAPI, Docker, Microservices, SQL",
        "6 years building web platforms, REST APIs, and microservices"
    )
    print(f"Created test PDF resume at {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
