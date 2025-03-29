package com.swu.room.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
public class Bgm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 255)
    private String audioUrl;
}
