package com.medflow.copilot.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Structured note-taking (agentic memory): the `notes` mode persists compact
 * structured notes per session OUTSIDE the transcript and loads them back
 * instead of raw history — the WRITE strategy, per Anthropic's guidance.
 */
@Service
public class NotesStore {
    private final Map<String, List<String>> notes = new ConcurrentHashMap<>();

    public List<String> forSession(String sessionId) {
        return notes.getOrDefault(sessionId, List.of());
    }

    public void append(String sessionId, String note) {
        notes.computeIfAbsent(sessionId, k -> new CopyOnWriteArrayList<>()).add(note);
    }

    public void clear(String sessionId) { notes.remove(sessionId); }
}
