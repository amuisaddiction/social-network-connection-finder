import tkinter as tk
from ui import SocialNetworkApp

def main():
    """
    Entry point for the Social Network Connection Finder application.
    Initializes Tkinter and starts the main application loop.
    """
    root = tk.Tk()
    
    # Optional: Configure style theme if available
    try:
        from tkinter import ttk
        style = ttk.Style()
        if 'clam' in style.theme_names():
            style.theme_use('clam')
    except Exception:
        pass
        
    app = SocialNetworkApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
