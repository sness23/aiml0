from openai import OpenAI
from pprint import pprint

# Initialize the OpenAI client
client = OpenAI()

def parse_markdown_file(filepath):
    """
    Reads a markdown file and extracts titles and text for the slides.
    
    Returns a dictionary where keys are slide titles and values are their corresponding text.
    """
    with open(filepath, "r") as file:
        content = file.read()
    
    # Split the content by two new lines to separate slides
    slides_content = content.split("\n\n")

    slides = {}
    for slide in slides_content:
        lines = slide.strip().split("\n")
        if not lines:
            continue
        title = lines[0].strip()  # The title is the first line (assumed to be a level one heading)
        text = "\n".join(lines[1:]).strip()  # The rest is the text
        if title.startswith('# '):  # Check if the title is marked as a level 1 heading
            slides[title[2:]] = text  # Remove '# ' from title

    return slides

# Load slides from a markdown file
markdown_file_path = "slides.md"  # Change this to your markdown file name
slides = parse_markdown_file(markdown_file_path)

# Iterate through each slide text and create speech output
i = 0
for title, text in slides.items():
    ntitle = str(i) + title 
    i += 1
    print(f"Generating speech for: {ntitle}")
    print(f"text: {text}")
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text,
    )

    # Specify the filename for the output MP3
    output_file = f"{ntitle.replace(' ', '_').lower()}.mp3"
    response.stream_to_file(output_file)
    print(f"Saved: {output_file}")

print("All audio files generated successfully.")

